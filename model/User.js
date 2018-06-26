const mongoose = require('mongoose');
const {hash, compare} = require('bcrypt');


const userSchema = mongoose.Schema({
    email: { type: String, require: true, trim: true, unique: true, lowercase: true },
    password: { type: String, require: true },
    name: { type: String, require: true, trim: true, minlength: 6, maxlength: 30 },
    phone: { type: String, trim: true, minLength: 9, maxlength: 12 },
    sex: { type: String, enum: ['male', 'female'], default: 'male' },
    dayOfBirth: { type: String },
    address: { type: String, require: true },
    roles: {
        type: String,
        enum: ['user', 'staff', 'admin'],
        default: 'user'
    },
    order: [{ type: mongoose.Schema.Types.ObjectId, href: 'Order'}],
    active: { type: Boolean, default: false },
    activeCode: { type: String }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(email, password, name, address, phone, sex, dayOfBirth, activeCode) {
        const encrypted = await hash(password, 8);
        const user = new User({ email, password: encrypted, name, address, phone, sex, dayOfBirth, activeCode });
        const error = user.validateSync();
        if (error) throw new Error(error);

        await user.save()
        .catch(error => {
            throw new Error('Duplicated email!');
        });
        const u = user.toObject();
        delete u.password;
        return u;
    }

    static async setRoles(idUser, role){
        const user = await User.findByIdAndUpdate(idUser, { roles: role })
        if(!user) throw new Error("Email not found");

        const u = user.toObject();
        delete u.password;
        return u;
    }

    static async setActive(idUser) {
        const user = await User.findByIdAndUpdate(idUser, { active: true })
        if(!user) throw new Error("Email not found");

        const u = user.toObject();
        delete u.password;
        return u;
    }

    static async comparePassword(idUser, password, cb) {
        User.findById(idUser)
        .then(user => {
            compare(password, user.password, (err, same)=> {
                if(err) return cb(err);
                return cb(null, same);
            });
        })
        .catch(err => {
            cb(err, false);
        });

    }

    static async changePassword(idUser, password) {
        const encrypted = await hash(password, 8);
        const user = await User.findByIdAndUpdate(idUser, {password: encrypted})
        if(!user) throw new Error("User not found");

        const u = user.toObject();
        delete u.password;
        return u;
    }
}

module.exports = User;