const express = require('express');
const router = express.Router();
const ProductLines = require('../model/ProductLines');

const app = express();
/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

// router.get('/test', (req, res) => {
//  res.render("");
// });

module.exports = router;
