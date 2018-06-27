const express = require('express');
const shopRouter = express.Router();
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');
const {rolesAuthorized, isLoggedIn} = require('../lib/auth.middleware');

/* GET shop page. */
shopRouter.get('/', (req, res) => {
    res.redirect('/shop/tshirt/1');    
});

shopRouter.get('/product/:id', (req, res) => {
    Product.findById(req.params.id)
    .then(product => {
        res.render('page/productDetails', { product, isLogin: req.isAuthenticated(), user: req.user });
    })
});

shopRouter.get('/:productline', (req, res) => {
    const productline = req.params.productline;
    res.redirect(`/shop/${productline}/1`);
});

shopRouter.get('/:productline/:page', (req, res) => {
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
        if(products.length === 0) return res.render('page/shop', {
            products,
            current: page,
            pages: Math.ceil(1 / perPage),
            productlines: productline,
            isLogin: req.isAuthenticated(),
            user: req.user
        })
        Product.count({ productLines: products[0].productLines })
        .then(length => {
            res.render('page/shop', {
                products,
                current: page,
                pages: Math.ceil(length / perPage),
                productlines: productline,
                isLogin: req.isAuthenticated(),
                user: req.user
            })
        })
    })
});

module.exports = shopRouter;
