const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const connectToMongoDB = require("./src/utils/mongoConnect");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
dotenv.config({ path: ".env" });

const app = express();
const port = process.env.PORT || 5000;

// mongodb conn
mongoConn = connectToMongoDB();

app.use(
  session({
    secret: "mysecret",
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Example: Session expires after 1 day (in milliseconds),
      secure: false,
    },
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://silvered:JRNLxEX6VAhFThe5@cluster0.lpcuahe.mongodb.net/silvered}?retryWrites=true&w=majority`,
      dbName: "sessions", // Optional: Specify the database name
      ttl: 24 * 60 * 60, // Session TTL (optional)
    }),
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://www.silvered.store",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
require("./src/config/passportPasswordStrategy")(passport);
require("./src/config/passportOTPStrategy")(passport);

app.use(authRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Silvered Backend");
});

app.listen(port, () => {
  console.log(`Silvered listening on port ${port}`);
});
