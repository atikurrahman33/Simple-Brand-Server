const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://foysalatik33:OUqXWjXOXakWL3zE@cluster0.o4gyyvr.mongodb.net/?retryWrites=true&w=majority";

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

    app.post('/users',async(req,res)=>{
      const user=req.body;
      console.log('new use',user);
      const result = await userCollection.insertOne(user);
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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})