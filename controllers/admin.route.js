const express = require('express');
const usersRouter = express.Router();
const {mustBeAdmin, isLoggedIn} = require('./mustBeUser.middleware');
const User = require('../model/User');
const Product = require('../model/Product');
const passportService = require('../lib/passport');
const passport = require('passport');

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

usersRouter.get('/login', (req, res, next) => {
  res.render('admin/login');
});

usersRouter.post('/login',passport.authenticate('local', {
  failureRedirect: '/admin/login',
  successRedirect: '/admin/products'
}));

usersRouter.get('/logout',isLoggedIn, mustBeAdmin, (req, res) => {
  req.logOut();
  req.destroy();
  res.redirect('/admin/login');
})

usersRouter.get('/products',isLoggedIn, mustBeAdmin, (req, res) => {
  Product.find()
  .then(listProducts => {
    res.render('admin/products', {listProducts});
  })
});

usersRouter.get('/editproduct/:idProduct',isLoggedIn, mustBeAdmin, (req, res) => {
  const idProduct = req.params.idProduct;
  Product.findById(idProduct)
  .then(productInfo => {
    res.render('admin/editproduct', {productInfo});
  })
  .catch(err => console.log(err));
});

usersRouter.post('/editproduct/:idProduct',isLoggedIn, mustBeAdmin, (req, res) => {
  const idProduct = req.params.idProduct;
  const { name, price, description, quantity } = req.body;
  Product.findByIdAndUpdate(idProduct, { name, price, description, quantityInStock: quantity})
  .then(() => res.redirect('/admin/products'))
  .catch(err => console.log(err));
});

usersRouter.get('/deleteproduct/:idProduct',isLoggedIn, mustBeAdmin, (req, res) => {
  const idProduct = req.params.idProduct;
  Product.findByIdAndRemove(idProduct)
  .then(()=> {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
});

usersRouter.get('/addproduct',isLoggedIn, mustBeAdmin, (req, res) => {
  res.render("admin/addproduct");
});

usersRouter.post('/addproduct',isLoggedIn, mustBeAdmin, (req, res) => {
  // const { name, price, description, quantity } = req.body;
  // Product.createProduct()
});

usersRouter.get('/showuser',isLoggedIn, mustBeAdmin, (req, res) => {
  User.find()
  .then(listUser => {
    res.render("admin/user", {listUser});
  })
  .catch(err => console.log(err));
});

module.exports = usersRouter;
