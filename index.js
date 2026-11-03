require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 1415;
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI must be configured in the server environment.");
}

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("hello notes");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  await client.connect();
  const collection = client.db("users").collection("info");

  app.post("/notes", async (req, res, next) => {
    try {
      const result = await collection.insertOne(req.body);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/notes", async (_req, res, next) => {
    try {
      const notes = await collection.find().toArray();
      return res.json(notes);
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/notes/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!/^[\da-f]{24}$/i.test(id)) {
        return res.status(400).json({ error: "Invalid note ID." });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Note not found." });
      }

      return res.status(200).json({ deleted: true });
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    console.error("Notes API request failed:", error);
    return res.status(500).json({ error: "Internal server error" });
  });

  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB.");
  app.listen(port, () => {
    console.log(`Notes API listening on port ${port}.`);
  });
}

run().catch((error) => {
  console.error("Could not start the notes API:", error);
  process.exitCode = 1;
});
