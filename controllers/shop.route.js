const express = require('express');
const shopRouter = express.Router();
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');
const {rolesAuthorized, isLoggedIn} = require('../lib/auth.middleware');
/* GET shop page. */
shopRouter.get('/', (req, res, next) => {
    console.log(req.isAuthenticated());
    res.redirect('/shop/tshirt/1');    
});

shopRouter.get('/product/:id', (req, res, next) => {
    console.log("Product details route",req.isAuthenticated());
    Product.findById(req.params.id)
    .then(product => {
        res.render('page/productDetails', { product, isLogin: req.isAuthenticated() });
    })
});

shopRouter.get('/:productline', (req, res, next) => {
    console.log("Product line route",req.isAuthenticated());

    const productline = req.params.productline;
    res.redirect(`/shop/${productline}/1`);
});

shopRouter.get('/:productline/:page', (req, res, next) => {
    console.log("Product line page route",req.isAuthenticated());

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
                productlines: products[0].productLines,
                isLogin: req.isAuthenticated()
            })
        })
    })
    .catch(err => {
        res.render('page/404');
        return next(err);
    });
});

module.exports = shopRouter;
