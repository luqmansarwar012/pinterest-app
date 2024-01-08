const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressSession = require("express-session");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const passport = require("passport");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const app = express();
require("dotenv").config();

// MongoDB Connection
mongoose.connect("mongodb://0.0.0.0:27017/pinterest-app");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// enabling flash messages
app.use(flash());

// setting up session
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "sessionSecret",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes for our application
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(4002, () => {
  console.log(`Listening at port: 4002`);
});

module.exports = app;
