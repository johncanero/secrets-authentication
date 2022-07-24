//jshint esversion:6

// essentials
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

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

// Secret String Instead of Two Keys
const secret = "Thisisourlittlesecret"
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });


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
    password: req.body.password
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
  const password = req.body.password;

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
