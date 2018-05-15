const express = require('express');
const router = express.Router();
const initDatabase = require('../initDatabase');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/shop');
});

router.get('/initfakedb', (req, res, next) => {
  initDatabase()
  .then( _ => res.redirect('/shop'));
})

module.exports = router;
