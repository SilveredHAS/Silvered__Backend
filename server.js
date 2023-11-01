const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  expressSession({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
require("./src/config/passport")(passport);

app.use(authRoutes);

// mongodb conn
const uri =
  "mongodb+srv://silvered:JRNLxEX6VAhFThe5@cluster0.lpcuahe.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Silvered Backend");
});

app.listen(port, () => {
  console.log(`Silvered listening on port ${port}`);
});
