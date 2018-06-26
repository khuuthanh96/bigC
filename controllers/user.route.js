const express = require('express');
const userRouter = express.Router();
const { isLoggedIn, rolesAuthorized } = require('./auth.middleware');
const User = require('../model/User');

userRouter.get('/', (req, res) => {
    res.redirect('/user/login');
})

userRouter.get('/login', (req, res) => {
    res.render('page/login-register');
})

userRouter.post('/login', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

userRouter.post('/signup', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

module.exports = userRouter