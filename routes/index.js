const express = require('express');
const router = express.Router();
const initDatabase = require('../initDatabase');
const ProductLines = require('../model/ProductLines');

const app = express();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/shop');
});

//test view
/*
router.get('/product', (req, res) => {
    res.render("admin/products");
});

router.get('/user', (req, res) => {
  res.render("admin/user");
});

router.get('/editproduct', (req, res) => {
  res.render("admin/editproduct");
});*/


// router.get('/initfakedb', (req, res, next) => {
//   initDatabase()
//   .then(msg => {
//     res.redirect('/shop');    
//   })
//   .catch(err => console.log(err));
// });

module.exports = router;
