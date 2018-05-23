const User = require('../model/User');

const admin = { 
    email: "admin@gmail.com",
    password: "admin",
    name: "Super Ad",
    address: "123st abc"
}
User.find({email: admin.email})
.then(isMatches => {
    if(isMatches.length === 0) { 
        User.signUp(admin.email, admin.password, admin.name, admin.address)
        .then(admin => {
            User.setRoles(admin._id, "admin");
        })
    }; 
})
.catch(err => console.log(err))


