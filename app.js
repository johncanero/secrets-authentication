//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

// LEVEL 3: REMOVE MONGOOSE ENCRYPTION
// const encrypt = require("mongoose-encryption");


const app = express()

// LEVEL 3: REMOVE PLUGIN USER SCHEMA
// console.log(process.env.API_KEY);



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// MONGOOSE CONNECT
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// MONGOOSE - USER SCHEMA AND MONGOOSE SCHEMA CLASS ENCRYPTION
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


// LEVEL 3: REMOVE PLUGIN USER SCHEMA
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


const User = new mongoose.model("User", userSchema);




// HOME ROUTE
app.get("/", function (req, res) {
  res.render("home");
});

// LOGIN ROUTE
app.get("/login", function (req, res) {
  res.render("login");
});

// REGISTER ROUTE
app.get("/register", function (req, res) {
  res.render("register");
});



// POST METHOD = REGISTER ROUTE
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    // LEVEL 3: USE HASH FUNCTION MD5
    password: md5(req.body.password)
  });

  newUser.save(function (err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});



// POST METHOD = LOGIN ROUTE
app.post("/login", function(req, res) {
  const username = req.body.username;
   // LEVEL 3: USE HASH FUNCTION MD5
  const password = md5(req.body.password);

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if(foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
})



//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
