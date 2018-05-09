const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

/* GET shop page. */
router.get('/', function(req, res, next) {
    Product.find().limit(12)
    .then(list => {
        res.render('shop', { list });
    })
});

module.exports = router;
