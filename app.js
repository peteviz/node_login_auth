const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");


const app = express();

//Passport Config
require("./config/passport")(passport);

//DB Config
const db = require("./config/keys").MongoURI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(db, {
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

//Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    }));

    //Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    //Connect Flash
    app.use(flash());

    //Global Vars
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        next();
    });

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
