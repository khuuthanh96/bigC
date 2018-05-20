const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const jwtStrategy = require('passport-jwt').Strategy;

const userSchema = mongoose.Schema({
    email: { type: String, require: true, trim: true, unique: true, lowercase: true },
    password: { type: String, require: true },
    name: { type: String, require: true, trim: true, minlength: 6, maxlength: 30 },
    phone: { type: String, trim: true, minLength: 9, maxlength: 12 },
    sex: { type: String, enum: ['male', 'female'], default: 'male' },
    dayOfBirth: { type: Date },
    address: { type: String, require: true },
    rolse: {
        type: String,
        enum: ['user', 'staff', 'admin'],
        default: 'user'
    }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(email, password, name, address) {
        const encrypted = hash(password, 8);
        const user = new User({email, password: encrypted, name, address});
        const error = user.validateSync();
        if(error) throw new Error('User info is invalid!');
        await user.save()
        .catch(error => {
            throw new Error('Duplicated email!');
        });
        const u = user.toObject();
        return u;
    }

    static async logIn(email, password) {
        passport.use(new localStrategy({
            usernameField: 'email'
        }), (email, password, done) => {
            User.findOne({email})
            .then(user => {
                if(!user) return done(null, false, { error: 'login failed. Please try again.'});

                
            })
        }
    );
    }
}

module.exports = User;