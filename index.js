const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4gyyvr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("userDB");
    const userCollection = database.collection("user");

    app.get('/users', async(req, res) => {
      const cursor = userCollection.find()
      const result=await cursor.toArray();
      res.send(result)
    })

    app.get('/newuser/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.findOne(query);
        res.send(result);
      })

    app.get('/brand/:category', async (req, res) => {
        try {
            const category = (req.params.category);
            if (category === 'Toyota' || category === 'Ford' || category === 'Honda' || category === 'Bmw' || category === 'Chevrolet'|| category === 'Nissan' )  {
                const result = await userCollection.find({ category }).sort({ _id: -1 }).toArray();
                res.status(200).json(result);
            } else {
                res.status(404).send("Invalid category");
            }
        } catch (error) {
            console.error("Error fetching lectures by category:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get('/newuser', async (req, res) => {
        console.log(req.query);
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email }
        }
        const cursor = userCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get('/newuser/ascending', async (req, res) => {
        console.log(req.query);
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email }
        }
        const cursor = userCollection.find(query).sort({price: 1});
        const result = await cursor.toArray();
        res.send(result);
      })
  
      app.get('/newuser/descending', async (req, res) => {
        console.log(req.query);
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email }
        }
        const cursor = userCollection.find(query).sort({price: -1});
        const result = await cursor.toArray();
        res.send(result);
      })

    app.post('/users',async(req,res)=>{
      const user=req.body;
      console.log('new use',user);
      const result = await userCollection.insertOne(user);
      res.send(result)
    });

    app.patch('/newUser/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedToy = req.body;
        console.log(updatedToy);
        const cars = {
          $set: {
            name: updatedToy.name,
            picture: updatedToy.picture,
            price: updatedToy.price,
            availableQuantity: updatedToy.availableQuantity,
            description: updatedToy.description,
  
          }
        }
  
        const result = await userCollection.updateOne(filter, cars, options);
        res.send(result)
      })

    app.delete('/users/:id', async(req, res) => {
      const id= req.params.id
      console.log('delete id',id)
      const query = {_id:new ObjectId(id)  };
      const result = await userCollection.deleteOne(query);
      res.send(result);

    
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})