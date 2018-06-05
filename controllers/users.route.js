const express = require('express');
const usersRouter = express.Router();
const {mustBeUser, roleAuthorization} = require('./mustBeUser.middleware');
const User = require('../model/User');
const Product = require('../model/Product');
const passportService = require('../lib/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

usersRouter.get('/login', (req, res, next) => {
  res.render('admin/login');
});

usersRouter.post('/login',requireLogin, (req, res, next) => {
  const { email, roles } = req.body;
  req.setRequestHeader('Authorization', 'jwt ' + req.body.user);
  res.redirect('users/admin/products');
  // res.cookie("Authorization", req.user.token, {maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true});
});

usersRouter.get('/admin/products',requireAuth ,(req, res) => {
  Product.find()
  .then(listProducts => {
    res.render('admin/products', {listProducts});
  })
});

usersRouter.get('/admin/editproduct/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;
  Product.findById(idProduct)
  .then(productInfo => {
    res.render('admin/editproduct', {productInfo});
  })
  .catch(err => console.log(err));
});

usersRouter.post('/admin/editproduct/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;
  const { name, price, description, quantity } = req.body;
  Product.findByIdAndUpdate(idProduct, { name, price, description, quantityInStock: quantity})
  .then(() => res.redirect('/users/admin/products'))
  .catch(err => console.log(err));
});

usersRouter.get('/admin/deleteproduct/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;
  Product.findByIdAndRemove(idProduct)
  .then(()=> {
    res.redirect('/users/admin/products');
  })
  .catch(err => console.log(err));
});

usersRouter.get('/admin/addproduct', (req, res) => {
  res.render("admin/addproduct");
});

usersRouter.post('/admin/addproduct', (req, res) => {
  // const { name, price, description, quantity } = req.body;
  // Product.createProduct()
});

usersRouter.get('/admin/showuser', (req, res) => {
  User.find()
  .then(listUser => {
    res.render("admin/user", {listUser});
  })
  .catch(err => console.log(err));
});

module.exports = usersRouter;
