const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlu12w4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //build Database
    const userCollection = client.db("bookStackDB").collection("users");
    const productCollection = client.db("bookStackDB").collection("products");

    //api start

    // user db start
    app.post("/users", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      let query = {};
      // condition for show users based on email
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      // console.log(req.headers);
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // data come from mongo
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    // update
    app.patch("/users/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: item.role,
          // name: item.name,
          // email: item.email,
          // photo: item.photo,
        },
      };

      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    // app.put("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedUserInfo = req.body;
    //   const updatedUser = {
    //     $set: {
    //       role: updatedUserInfo.role,
    //       name: updatedBlogInfo.name,
    //       email: updatedBlogInfo.email,
    //       photo: updatedBlogInfo.photo,
    //     },
    //   };
    //   const result = await userCollection.updateOne(
    //     filter,
    //     updatedUser,
    //     options
    //   );
    //   res.send(result);
    // });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // user db end
    //product api start
    // show all blog in server from db
    app.get("/products", async (req, res) => {
      // show data from DB in array formet
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    //read or get specific blog by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // data come from mongo
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    // create new blog
    app.post("/products", async (req, res) => {
      const newBlog = req.body;

      // send data to DB
      const result = await productCollection.insertOne(newBlog);
      res.send(result);
    });
    // update blog info by client response
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBlogInfo = req.body;
      const updatedBlog = {
        $set: {
          title: updatedBlogInfo.title,
          short_description: updatedBlogInfo.short_description,
          long_description: updatedBlogInfo.long_description,
          details_image: updatedBlogInfo.details_image,
          date: updatedBlogInfo.date,
          time: updatedBlogInfo.time,
          category: updatedBlogInfo.category,
          owner_name: updatedBlogInfo.owner_name,
          owner_image: updatedBlogInfo.owner_image,
          owner_Email: updatedBlogInfo.owner_Email,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedBlog,
        options
      );
      res.send(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    //product api end
    //api finish

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//testing server running or not
app.get("/", (req, res) => {
  res.send("bookstack server is running");
});
app.listen(port, () => {
  console.log(`bookstack server is running ${port}`);
});
