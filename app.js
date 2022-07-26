//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");


const app = express();


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
  useUnifiedTopology: true
  }, err => {
  if(err) throw err;
  console.log('Connected to MongoDB')
});



// MONGOOSE - USER SCHEMA AND MONGOOSE SCHEMA CLASS ENCRYPTION
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: String,
});


// PLUGIN
// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - PASSPORT LOCAL
userSchema.plugin(passportLocalMongoose);
// LEVEL 6: OAuth 2.0 & HOW TO IMPLEMENT SIGN IN WITH GOOGLE - FINDorCREATE
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//passport.deserializeUser(function (user, done) {
//  done(null, user);
//});



// Google
// LEVEL 6: OAuth 2.0 & HOW TO IMPLEMENT SIGN IN WITH GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",

      // The next will pull user credentials using Google API
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },

    // Google sends a token which allows access to profile credentials
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      // Either find a user, or create a new account.
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);



//* Facebook *//
passport.use(new FacebookStrategy({
  clientID: 346503394348987,
  clientSecret: 'd4ba7cd4ae42587f29cf2040d4875c05',
  callbackURL: "http://localhost:3000/auth/facebook/secrets",
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));



// HOME ROUTE
app.get("/", function (req, res) {
  res.render("home");
});




//* Google *//

app.route("/auth/google").get(
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);


//* Facebook *//
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });




  


// LOGIN ROUTE
app.get("/login", function (req, res) {
  res.render("login");
});

// REGISTER ROUTE
app.get("/register", function (req, res) {
  res.render("register");
});


// SECRETS ROUTE
app.get("/secrets", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});



// SUBMIT ROUTE
app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});



app.post("/submit", function (req, res) {
  const submittedSecret = req.body.secret;

  //console.log(req.user.id);

  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function () {
          res.redirect("/secrets");
        });
      }
    }
  });
});



// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - PASSPORT AUTHENTICATION - REGISTER
app.post("/register", function(req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});




// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - PASSPORT AUTHENTICATION - LOGIN
app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      // Authenticates user using password and username
      passport.authenticate("local");
      res.redirect("/secrets");
    }
  });
})


// LEVEL 5: PASSPORT.JS TO ADD COOKIES AND SESSION - PASSPORT AUTHENTICATION - LOGOUT
app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
});




app.listen(3000, function () {
  console.log("Server started on port 3000");
});
