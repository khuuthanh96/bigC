const User = require('../model/User');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
};

exports.isUserLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
};

exports.isActiveAccount = (req, res, next) => {
    console.log(req.user);
    if(req.user.active) {
        return next();
    }
    res.send('Your account need to active with your email!');
}

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
