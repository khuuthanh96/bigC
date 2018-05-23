const { verify } = require('../lib/jwt');
const User = require('../model/User');
exports.mustBeUser = (req, res, next) =>{
    console.log(req.headers.token);
    verify(req.headers.token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(err => {
        console.log(err);
    })
};

exports.roleAuthorization = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        User.findById(user._id)
        .then(foundUser => {
            if(roles.indexOf(foundUser.roles) > -1) {
                return next();
            }
            res.status(422).json({error: "You are not authorized to view this content"});
            return next("Unauthorized");
        })
        .catch(err => { return next(err) });
    }
}