const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, require: true, trim: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true, trim: true, minlength: 6, maxlength: 30 },
    phone: { type: String, trim: true, minLength: 9, maxlength: 12 },
    sex: { type: Boolean },
    dayOfBirth: { type: Date.now },
    address: { type: String, require: true }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {

}

module.exports = User;