const express = require('express');
const shopRouter = express.Router();
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');

/* GET shop page. */
shopRouter.get('/', (req, res, next) => {
    res.redirect('/shop/tshirt/1');    
});

shopRouter.get('/product/:id', (req, res, next) => {
    Product.findById(req.params.id)
    .then(product => {
        res.render('page/productDetails', { product });
    })
});

shopRouter.get('/:productline', (req, res, next) => {
    const productline = req.params.productline;
    res.redirect(`/shop/${productline}/1`);
});

shopRouter.get('/:productline/:page', (req, res, next) => {
    const perPage = 9;
    const page = req.params.page || 1;
    const productline = req.params.productline;

    ProductLines.find({ name: productline })
    .then(productLine => {
        return Product.find({ productLines: productLine[0]._id })
        .limit(perPage)
        .skip((perPage * page) - perPage)
    })
    .then(products => {
        Product.count({ productLines: products[0].productLines })
        .then(length => {
            res.render('page/shop', {
                products,
                current: page,
                pages: Math.ceil(length / perPage),
                productlines: products[0].productLines
            })
        })
    })
    .catch(err => {
        res.render('page/404');
        return next(err);
    });
});

module.exports = shopRouter;
