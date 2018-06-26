const express = require('express');
const userRouter = express.Router();
const { isUserLoggedIn, rolesAuthorized } = require('../lib/auth.middleware');
const User = require('../model/User');
const passport = require('passport');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: "tempthanh321@gmail.com",
        clientId: "171147969598-29bi9u3ihussbe81he5de9fuqc1adlug.apps.googleusercontent.com",
        clientSecret: "rf-1OObFP2MwHq1PeQtizPu8",
        refreshToken: "1/5Xqx85Y2wgpYGyeAbv_aATXD7oUDWIIHHrpun5-I2JeZEE-4Cedi7oU8GgYXDeSv",
        accessToken: "ya29.GlvmBQVebN5KT4iIt-OYQH6iRP75-0vGjBbZok3z-Uuo7OLxLMj40PakJ49idTlv4jDnsUSgL4PowM6_ShEmagA2hpO2kPV0wBHiGfFasm8BH6TFfx_GwxxJ8Kux"
    }
})

userRouter.get('/', (req, res) => {
    res.redirect('/user/login');
})

userRouter.get('/login', (req, res) => {
    res.render('page/login-register', {isLogin: false, error: req.flash('error')});
})

userRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/user/login',
    successRedirect: '/shop',
    failureFlash: 'Invalid username or password.'
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
        if(userExisting) {
            req.flash('error', 'Email in use!!!');
            res.redirect('/user/login');
        };
        
        return User.signUp(email, password,name,address,phone,sex,birthday,randomstring.generate(30));
    })
    .then(user => {
        if(!user) return console.log('Email in use');
        const link = `http://${req.get('host')}/user/verify/${user.activeCode}`;
        const mailOptions = {
            from: 'Eshopper Verify Email <tempthanh321@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'Verify your account Eshopper', // Subject line
            html: `
            <h1>Hello ${user.name}</h1>
            <p>Press link to verify your account!!!! hihi</p>
            <a href="${link}">Click here to verify</a>`// plain text body
        }
        transporter.sendMail(mailOptions, (err, result)=> {
            if(err) return console.log(err)
            res.redirect('/');
        })
    })
})

userRouter.get('/verify/:activeCode', (req, res) => {
    const code = req.params.activeCode;
    User.findOne({activeCode: code})
    .then(async (user) => {
        const u = await User.setActive(user._id)
        return new Promise((resolve, reject) => {
            req.logIn(u, (err) => {
              if (err) { reject(err); }
              resolve(u);
            });
        })
    })
    .then( _ => res.redirect('/'))
})

userRouter.get('/password', 
    isUserLoggedIn,
    (req, res) => {
        res.render('page/user-change-pass', {
            isLogin: req.isAuthenticated(), 
            error: req.flash('error'), 
            msg: req.flash('msg')
        })
    }
)

userRouter.post('/password', 
    isUserLoggedIn,
    (req, res) => {
        const {oldPass, newPass} = req.body;
        User.comparePassword(req.user._id, oldPass, (err,same) => {
            if(err) {
                req.flash('error', "Password is incorrect");
                return res.redirect('/user/password');
            }

            if(!same) {
                req.flash('error', "Password is incorrect");
                return res.redirect('/user/password');
            }

            User.changePassword(req.user._id, newPass)
            .then(user => { 
                console.log(user);
                req.flash('msg', 'Successfully!');
                console.log('hello kiki');
                return res.redirect('/user/password')
            })
        })
    }
)
module.exports = userRouter