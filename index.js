const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
// -----

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.US_NAME}:${process.env.US_PASS}@cluster0.6cfnsid.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("next").collection("services");
    const reviewCollection = client.db('next').collection('review')


    // service
    app.get("/services3", async (req, res) => {
      const query = {};
      const limit = 3;
      const sort = { length: -1 };
      const cursor = serviceCollection.find(query).sort(sort).limit(limit);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post('/services', async (req, res) => {
      const service = req.body
      const result = await serviceCollection.insertOne(service)
      res.send(result)
    })

      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.findOne(query);
        res.send(result);
      });
    // ----


    // reviews
    app.post('/reviews', async (req, res) => {
      const review = req.body
      const result = await reviewCollection.insertOne(review)
      res.send(result)
    })


    app.get('/reviews', async (req, res) => {
      let query = {}
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/reviews/:id', async (req, res) => {
      const id = req.params.id
      const query = {serviceId: id}
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    // update review
    app.patch('/reviews/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const editText = req.body
      const option = { upsert: true }
      const updatetext = {
        $set: {
          text: editText.text
        }
      }
      const result = await reviewCollection.updateOne(query, updatetext, option)
      res.send(result)
    })


    // delete review 
    app.delete('/reviews/:id', async (req, res)=>{
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })
    // ----

  } finally {
  }
}

app.get("/", (req, res) => {
  res.send("welcome next server");
});

app.listen(port, () => {
  console.log(`Enext is working ${port}`);
});

run().catch((err) => console.error(err));
