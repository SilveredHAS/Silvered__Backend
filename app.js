const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const DecryptMiddleware = require("./src/middleware/decryptMiddlware");
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

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

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
console.log(process.env.FRONTEND_URL);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the list of allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
require("./src/config/passportPasswordStrategy")(passport);
require("./src/config/passportOTPStrategy")(passport);
require("./src/config/passportPasswordStrategyAffiliate")(passport);
require("./src/config/passportOTPStrategyAffiliate")(passport);

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
