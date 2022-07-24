//jshint esversion:6 

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const mongoose = require('mongoose');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


// HOME ROUTE
app.get("/", function(req, res){
  res.render("home");
});

// LOGIN ROUTE
app.get("/login", function(req, res) {
  res.render("login");
});

// REGISTER ROUTE
app.get("/register", function(req, res) {
  res.render("register");
});









//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});