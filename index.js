const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
// -----

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.US_NAME}:${process.env.US_PASS}@cluster0.6cfnsid.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("next").collection("services");

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
