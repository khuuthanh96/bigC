const express = require('express');
const fs = require('fs')
const adminRouter = express.Router();
const {rolesAuthorized, isLoggedIn} = require('../lib/auth.middleware');

const User = require('../model/User');
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');
const Order = require('../model/Order');

const passport = require('passport');
const uploadConfig = require('../lib/uploadImageConfig');

const uploadImage = uploadConfig.single('image')

/* GET users listing. */
adminRouter.get('/', function(req, res, next) {
  res.redirect('/admin/login');
});

adminRouter.get('/login', (req, res, next) => {
  res.render('admin/login');
});

adminRouter.post('/login',passport.authenticate('local', {
  failureRedirect: '/admin/login',
  successRedirect: '/admin/products',
  failureFlash: 'Invalid username or password.'
}));

adminRouter.get('/logout',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    req.logOut();
    req.destroy();
    res.redirect('/admin/login');
})

adminRouter.get('/products',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    Product.find()
    .then(listProducts => {
      res.render('admin/products', {listProducts});
    })
});

adminRouter.get('/editproduct/:idProduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    const idProduct = req.params.idProduct;
    Product.findById(idProduct)
    .then(async (productInfo) => {
      const prodL = await ProductLines.findById(productInfo.productLines);
      console.log(prodL);
      res.render('admin/editproduct', {productInfo, prodLName: prodL.name});
    })
    .catch(err => console.log(err));
});

adminRouter.post('/editproduct/:idProduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    uploadImage(req, res, async (err) => {
      if(err) return res.send(err);
      const idProduct = req.params.idProduct;
      const info = req.body;
      const prodL = await ProductLines.findOne({name: info.productLines});

      Product.findByIdAndUpdate(idProduct, { 
        name: info.name, 
        price: info.price,
        productLines: prodL._id,
        quantityInStock: info.quantity,
        size: info.size,
        status: info.status,
        description: info.description
      })
      .then(() => {
        if(req.file) {
          Product.findByIdAndUpdate(idProduct, {$push: { images: req.file.filename }})
          .then(() => res.redirect('/admin/products'))
          
        }
        res.redirect('/admin/products')
      })
      .catch(err => console.log(err));
    })
});

adminRouter.get('/deleteproduct/:idProduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    const idProduct = req.params.idProduct;
    Product.findByIdAndRemove(idProduct)
    .then(p => {
      p.images.forEach(img => {
        fs.unlinkSync(`./public/images/shop/${img}`)
      })
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
});

adminRouter.get('/addproduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    res.render("admin/addproduct");
});

adminRouter.post('/addproduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']),
  (req, res) => {
    uploadImage(req, res, async (err) => {
      if(err) return res.send(err);
      const info = req.body;

      const prodL = await ProductLines.findOne({name: info.productLines});

      const product = new Product({ 
        name: info.name, 
        price: info.price,
        productLines: prodL._id,
        quantityInStock: info.quantity,
        size: info.size,
        status: info.status,
        description: info.description
      });
      const p = await product.save();

      if(req.file) {
        Product.findByIdAndUpdate(p._id, {$push: { images: req.file.filename }})
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
      }
      res.redirect('/admin/products')
 
    })
});

adminRouter.get('/showuser',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    User.find({roles: 'user'})
    .then(listUser => {
      res.render("admin/user", {listUser});
    })
    .catch(err => console.log(err));
});

adminRouter.get('/showorder',
  isLoggedIn,
  rolesAuthorized(['admin', 'staff']),
  (req, res) => {
    res.render("admin/orders");
  }
)

module.exports = adminRouter;
