//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - DELETE BCRYPT
// const bcrypt = require("bcrypt");
// const saltRounds = 10;


// LEVEL 4: SALTING AND HASHING - CHANGE MD5 TO BYCRYPT
// const md5 = require("md5");


// LEVEL 3: HASHING PASSWORDS -  REMOVE MONGOOSE ENCRYPTION
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


// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - APP.USE SESSION and INITIALIZE PASSPORT
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passport.initialize());
app.use(passport.session());



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


// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - PASSPORT LOCAL
userSchema.plugin(passportLocalMongoose);


// LEVEL 3: REMOVE PLUGIN USER SCHEMA
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);


// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - PASSPORT 
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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


// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - DELETE POST METHOD REGISTER ROUTE 
// POST METHOD = REGISTER ROUTE
// app.post("/register", function(req, res) {

//   // LEVEL 4: BCRYPT HASH
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//        // Store hash in your password DB.
//       const newUser = new User({
//       email: req.body.username,
//       // LEVEL 4: HASH PASSWORD
//       password: hash

//       // LEVEL 3: USE HASH FUNCTION MD5
//       // password: md5(req.body.password)
//     });
  
//     newUser.save(function (err){
//       if (err) {
//         console.log(err);
//       } else {
//         res.render("secrets");
//       }
//     });
//   });
// });




// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - DELETE POST METHOD LOG-IN ROUTE 
// POST METHOD = LOGIN ROUTE
// app.post("/login", function(req, res) {
//   const username = req.body.username;
//    // LEVEL 3: USE HASH FUNCTION MD5
//   const password = req.body.password;

//   User.findOne({email: username}, function(err, foundUser){
//     if (err) {
//       console.log(err);
//     } else {
//       if(foundUser) {
//         // BYCRYPT COMPATE METHOD
//         bcrypt.compare(password, foundUser.password, function(err, result) {
//           if (result === true) {
//             res.render("secrets");  
//           }
//       });
//       }
//     }
//   });
// })



app.post("/register", function(req, res) {


});



app.post("/login", function(req, res) {

})



//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
