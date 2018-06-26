const User = require('../model/User');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login!')
    res.redirect('/admin/login');
};

exports.isUserLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login!')
    res.redirect('/user/login');
};

exports.isActiveAccount = (req, res, next) => {
    console.log(req.user);
    if(req.user.active) {
        return next();
    }
    res.redirect('/user/inactive');
}

exports.rolesAuthorized = (roles) => {
    return (req, res, next) => {
        for (let i = 0; i < roles.length; i++) {
            if (req.user.roles === roles[i]){
                return next();
            }
        }
        req.flash('error', 'Unauthorized!')
        res.redirect('/admin/login');
    };
};
