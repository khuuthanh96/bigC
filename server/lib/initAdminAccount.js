const User = require('../model/User');

const admin = { 
    email: "admin@gmail.com",
    password: "admin",
    name: "Super Ad",
    address: "123st abc"
}
User.signUp(admin.email, admin.password, admin.name, admin.address)
.then(admin => {
    return User.setRoles(admin._id, "admin")
})
.catch(err => console.log(err));
