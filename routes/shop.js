const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

/* GET shop page. */
router.get('/', (req, res, next) => {
    Product.find().limit(12)
    .then(list => {
        res.render('shop', { list });
    })
});

router.get('/:id', (req, res, next) =>{
    Product.findById(req.params.id)
    .then(product => {
        res.render('productDetails', { product });
    })
});

module.exports = router;
