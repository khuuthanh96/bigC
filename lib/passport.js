const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const {compare} = require('bcrypt');
const User = require('../model/User');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((idUser, done) => {
    User.findById(idUser)
    .then(user => done(null, user))
    .catch(err => console.log(err));
});

passport.use(new Strategy((email, password, done) =>{
    User.find({ email })
    .then(user => {
        compare(password, user.password, (err, result) => {
            if(err) return done(err);
            if(!result) return done(null, false, {message: "Incorrect email and password"});
            return done(null, user);
        });
    })
    .catch(err => done(err));
}));