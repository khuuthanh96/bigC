const { verify } = require('../lib/jwt');

exports.mustBeUser = (req, res, next) =>{
    verify(req.headers.token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(err => {
        next(err);
    })
};