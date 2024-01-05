const express = require('express');
const router = express.Router();
const userModel = require('./users')
const passport = require('passport')
const localStrategy = require('passport-local')
passport.authenticate(new localStrategy(userModel.authenticate()))
router.get('/', function (req, res, next) {
    res.render('index');
});
router.post('/register', function (req, res, next) {
    const {username, email, password, fullname} = req.body
    const userData = new userModel({
        username, email, fullname
    })
    userModel.register(userData, password).then(function () {
        passport.authenticate('local')(req, res, function () {
            res.redirect('/profile')
        })
    })
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

router.post('/logout', function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
router.get('/profile', isLoggedIn,function(req, res, next){
   res.render('index')
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())return next()
    res.redirect('/')
}

module.exports = router;
