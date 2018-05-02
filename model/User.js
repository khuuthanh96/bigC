const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, require: true, trim: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true, trim: true, minlength: 6, maxlength: 30 },
    phone: { type: String, trim: true, minLength: 9, maxlength: 12 },
    sex: { type: Boolean },
    dayOfBirth: { type: String },
    address: { type: String, require: true }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(email, password, name, address) {
        const user = new User({email, password, name, address});
        const error = user.validateSync();
        if(error) throw new Error('User info is invalid!');
        await user.save()
        .catch(error => {
            throw new Error('Duplicated email!');
        });
        const u = user.toObject();
        return u;
    }
}

module.exports = User;