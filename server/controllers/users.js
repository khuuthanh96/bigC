const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

router.get('/login', (req, res, next) => {
  res.send("Welcome to login page");
});

module.exports = router;
