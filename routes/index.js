const express = require('express');
const router = express.Router();
const initDatabase = require('../initDatabase');
const ProductLines = require('../model/ProductLines');

const app = express();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/shop');
});

router.get('/initfakedb', (req, res, next) => {
  initDatabase()
  .then(msg => {
    res.redirect('/shop');    
  })
  .catch(err => console.log(err));
});

module.exports = router;
