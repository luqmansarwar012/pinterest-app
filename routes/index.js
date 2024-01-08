const express = require("express");
const router = express.Router();
const userModel = require("./users");
const pinModel = require("./pins");
const passport = require("passport");
const upload = require("./multer");
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
  userModel.register(userData, password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/feed");
    });
  });
});

// login page display
router.get("/loginpage", function (req, res) {
  res.render("loginpage", { error: req.flash("error") });
});

// login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/loginpage",
    failureFlash: true,
  })
);

// logout logic
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/loginpage");
  });
});

// profile page rendring
router.get("/profile", isLoggedIn, async function (req, res, next) {
  // fetching user from database using user info from session
  // populating: getting pin data from pin table using reference
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("pins");
  const userObj = user.toJSON;
  console.log("userrrr", userObj);
  console.log("pinsss", user.pins);
  res.render("profile", { user });
});

// feed rendring
router.get("/feed", isLoggedIn, function (req, res, next) {
  res.render("feed");
});

// to upload a post
router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(400).send("no files were sent");
    }
    // fetching user from database
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const pinData = await pinModel.create({
      title: req.body.filecaption,
      imageUrl: req.file.filename,
      description: req.body.filecaption,
      user: user._id,
    });
    user.pins.push(pinData._id);
    await user.save();
    res.send("file uploaded successfully");
  }
);

// checking if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/loginpage");
}

module.exports = router;
