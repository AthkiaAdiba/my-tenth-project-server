const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ui1n29x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();

    const database = client.db("touristsSpotDB");
    const spotsCollection = database.collection("spots");
    const countriesCollection = database.collection("countries");
    const guidesCollection = database.collection("guides");


    app.get('/addSpot', async (req, res) => {
      const cursor = spotsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // get one data for showing details
    app.get('/addSpot/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await spotsCollection.findOne(query)
      res.send(result);
    });


    // get one data for update
    app.get('/update/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await spotsCollection.findOne(query)
      res.send(result);
    });


    app.get('/addSpot-email/:email', async (req, res) => {
      const result = await spotsCollection.find({ userEmail: req.params.email }).toArray();
      // console.log(result)
      res.send(result);
    });


    app.post('/addSpot', async (req, res) => {
      const addSpot = req.body;
      console.log(addSpot)
      const result = await spotsCollection.insertOne(addSpot);
      res.send(result);
    });


    // update
    app.put('/updateSpot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const sendSpot = req.body;
      const updatedSpot = {
        $set: {
          countryName: sendSpot.countryName,
          spotName: sendSpot.spotName,
          location: sendSpot.location,
          cost: sendSpot.cost,
          season: sendSpot.season,
          photo: sendSpot.photo,
          travelTime: sendSpot.travelTime,
          visitors: sendSpot.visitors,
          description: sendSpot.description
        }
      }

      const result = await spotsCollection.updateOne(filter, updatedSpot, options);
      res.send(result);
    });



    app.delete('/addSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotsCollection.deleteOne(query)
      res.send(result);
    });


    // countries related
    app.get('/countries', async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    // get data by country name
    app.get('/countryWiseCards/:countryName', async (req, res) => {
      const result = await spotsCollection.find({ countryName: req.params.countryName }).toArray();
      console.log(result)
      res.send(result);
    });



    // guides related
    app.get('/guides', async (req, res) => {
      const cursor = guidesCollection.find();
      const result = await cursor.toArray();
      res.send(result)
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
  res.send('My assignment project is running.')
});

app.listen(port, () => {
  console.log(`My assignment project is running on port: ${port}`)
});