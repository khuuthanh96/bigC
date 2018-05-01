const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, require: true, trim: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true, trim: true },
    phone: { type: String, trim: true },
    sex: { type: Boolean },
    dayOfBirth: { type: Date },
    address: { type: String, require: true }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {

}

module.exports = User;