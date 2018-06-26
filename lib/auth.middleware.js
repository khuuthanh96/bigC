const User = require('../model/User');

exports.isLoggedIn = (req, res, next) => {
    console.log("islogin", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
};

exports.isUserLoggedIn = (req, res, next) => {
    console.log("islogin", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
};

exports.rolesAuthorized = (roles) => {
    return (req, res, next) => {
        for (let i = 0; i < roles.length; i++) {
            if (req.user.roles === roles[i]){
                return next();
            }
        }
        res.redirect('/admin/login');
    };
};
