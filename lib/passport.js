const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');

const localLogin = new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email })
    .then(user => {
        if (!user) return done(null, false, {error: "login failed. Please try again!"});
        User.comparePassword(user._id, password, (err, same)=>{
            if(err) return done(err);

            if(!same) return done(null, false, {error: 'password is incorrect'});
            const u = user.toObject();
            delete u.password;
            
            sign({ _id: u._id, role: u.roles})
            .then(token => {
                u.token = token;
                return done(null, u);
            })
            .catch(err => done(err));
        });
    });
});

passport.use(localLogin);

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
        if(!user) return done(null, false);
        return done(null, user);
    })
    .catch(err => done(err));
});