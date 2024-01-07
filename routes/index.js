const express = require("express");
const router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

// home route to render index page
router.get("/", function (req, res, next) {
  res.render("index");
});

// user register logic
router.post("/register", function (req, res, next) {
  const { username, email, password, fullname } = req.body;
  const userData = new userModel({
    username,
    email,
    fullname,
  });
  console.log("blahhh");
  userModel.register(userData, password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/feed");
    });
  });
});

// login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/loginn",
  })
);

// login page display
router.get("/loginn", function (req, res) {
  res.render("login");
});

// log out logic
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/loginn");
  });
});

// profile page rendring
router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile");
});

// feed rendring
router.get("/feed", isLoggedIn, function (req, res, next) {
  res.render("feed");
});

// checking if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/loginn");
}

module.exports = router;
