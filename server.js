const express = require("express");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const connectToMongoDB = require("./src/utils/mongoConnect");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  expressSession({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
require("./src/config/passportEmailStrategy")(passport);

app.use(authRoutes);
app.use(productRoutes);

// mongodb conn
mongoConn = connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Welcome to Silvered Backend");
});

app.listen(port, () => {
  console.log(`Silvered listening on port ${port}`);
});
