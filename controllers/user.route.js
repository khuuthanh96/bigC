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
    successRedirect: '/shop'
}));

userRouter.get('/logout',
    isUserLoggedIn,
    (req, res) => {
        console.log(req.isAuthenticated());
        req.logOut();
        req.destroy();
        res.redirect('/shop')
})

userRouter.get('/account',
    isUserLoggedIn,
    (req, res) => {
        res.render('page/manage-user-info', {isLogin: req.isAuthenticated()});
    }
)

userRouter.post('/signup', (req, res) => {
    const {email, name, phone, sex, birthday, password, address} = req.body;
    User.findOne({email})
    .then(userExisting => {
        if(userExisting) return res.send('Email in used');
        
        return User.signUp(email, password,name,address,phone,sex,birthday)
    })
    .then(user => {
        return new Promise((resolve, reject) => {
            req.logIn(user, (err) => {
              if (err) { reject(err); }
              resolve(user);
            });
        });
    })
    .then(() => res.redirect('/'));
 
})

module.exports = userRouter