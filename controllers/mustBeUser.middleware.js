const { verify } = require('../lib/jwt');
const User = require('../model/User');
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
};

exports.mustBeAdmin = (req, res, next) => {
    if (req.user.roles === 'admin') {
        return next();
    }
    res.redirect('/admin/login');
};