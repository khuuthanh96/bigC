const express = require('express');
const usersRouter = express.Router();
const {mustBeUser, roleAuthorization} = require('./mustBeUser.middleware');
const User = require('../model/User');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const Product = require('../model/Product');
/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

usersRouter.get('/login', (req, res, next) => {
  res.render('admin/login');
});

usersRouter.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  User.logIn(email, password)
  .then(user => {
    req.headers.token = user.token;
    console.log(req.headers.token);
    res.redirect('/users/admin')
  })
  .catch(err =>{
    console.log(err);
    res.redirect('/users/login');
  });
});

usersRouter.get('/admin', (req, res) => {
  Product.find()
  .then(listProduct => {
    res.render('admin/home', {listProduct});
  })
});

usersRouter.get('/admin/editproduct/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;
  Product.findById(idProduct)
  .then(productInfo => {
    res.render('admin/productDetails', {productInfo});
  })
  .catch(err => console.log(err));
});

usersRouter.post('/admin/editproduct/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;
  const { name, price, description, quantity } = req.body;
  Product.findByIdAndUpdate(idProduct, { name, price, description, quantityInStock: quantity})
  .then(() => res.redirect('/users/admin'))
  .catch(err => console.log(err));
});

usersRouter.get('/admin/deleteproduct/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;
  Product.findByIdAndRemove(idProduct)
  .then(()=> {
    res.redirect('/users/admin');
  })
  .catch(err => console.log(err));
});

usersRouter.get('/admin/user', (req, res) => {
  User.find()
  .then(listUser => {
    res.render("");
  })
  .catch(err => console.log(err))
})

module.exports = usersRouter;
