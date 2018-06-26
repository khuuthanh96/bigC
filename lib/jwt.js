const jwt = require('jsonwebtoken');

const KEY = "mn1bgt61ij6hgt5rfgbhji89okjh"; // secret key

function sign(obj) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, KEY, { expiresIn: "2d" }, (err, token) => {
            if(err) return reject(err);
            resolve(token);
        })
    });
};

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, KEY, (err, obj) => {
            if(err) return reject(err);
            resolve(obj);
        });
    });
};
module.exports = { sign, verify, KEY };