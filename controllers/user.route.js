const express = require('express');
const userRouter = express.Router();
const { isUserLoggedIn, rolesAuthorized } = require('../lib/auth.middleware');
const User = require('../model/User');
const passport = require('passport');

userRouter.get('/', (req, res) => {
    res.redirect('/user/login');
})

userRouter.get('/login', (req, res) => {
    res.render('page/login-register', {isLogin: false});
})

userRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/user/login',
    successRedirect: '/shop',
    failureFlash: 'Invalid username or password.'
}));

userRouter.get('/logout',
    (req, res) => {
        console.log(req.isAuthenticated());
        // req.logOut();
        // req.destroy();
        // res.redirect('/shop');
})

userRouter.post('/signup', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

module.exports = userRouter