const express = require('express');
const userRouter = express.Router();
const { isUserLoggedIn, isActiveAccount, rolesAuthorized } = require('../lib/auth.middleware');
const User = require('../model/User');
const passport = require('passport');
const randomstring = require('randomstring');
const {transporter, mailOptions} = require('../lib/verifyMail');

userRouter.get('/', (req, res) => {
    res.redirect('/user/login');
})

userRouter.get('/login', (req, res) => {
    res.render('page/login-register', {isLogin: false, error: req.flash('error'), user: req.user});
})

userRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/user/login',
    successRedirect: '/shop',
    failureFlash: 'Invalid username or password.'
}));

userRouter.get('/logout',
    isUserLoggedIn,
    (req, res) => {
        req.logOut();
        req.destroy();
        res.redirect('/shop')
})

userRouter.get('/account',
    isUserLoggedIn,
    (req, res) => {
        res.render('page/user-info', {isLogin: req.isAuthenticated(), user: req.user});
    }
)

userRouter.get('/forgot-password',
    (req, res) => {
        res.render('page/forgot-password');
    }
)


userRouter.post('/reset-password',(req,res) => {
    const{newPass} = req.body;
    
    User.changePassword(req.user._id, newPass)
            .then(user => { 
                req.flash('msg', 'Successfully!');
                return res.redirect('/user/login')
            })
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
        
        transporter.sendMail(mailOptions(email, user.name, link), (err, result)=> {
            if(err) return console.log(err)
            req.logIn(user, (err) => {
                res.redirect('/');
            })
        })
    })
})

userRouter.get('/inactive', 
    isUserLoggedIn,
    (req, res) => {
        res.render('page/verify', { isLogin: req.isAuthenticated(), user: req.user});
});

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
    .then( _ =>{
        res.redirect('/')
    })
});

userRouter.get('/password', 
    isUserLoggedIn,
    (req, res) => {
        res.render('page/user-change-pass', {
            isLogin: req.isAuthenticated(), 
            error: req.flash('error'), 
            msg: req.flash('msg'),
            user: req.user
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
                req.flash('msg', 'Successfully!');
                return res.redirect('/user/password')
            })
        })
    }
)

module.exports = userRouter