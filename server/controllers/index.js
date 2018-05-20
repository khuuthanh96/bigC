const express = require('express');
const router = express.Router();
const ProductLines = require('../model/ProductLines');

const app = express();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/shop');
});

module.exports = router;
