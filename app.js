const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ProductLines = require('./model/ProductLines');

require('./db');
const initDatabase = require('./initDatabase');
initDatabase()
.then(msg => {
    console.log(msg);
    ProductLines.find()
    .then(list => {
        let listName = [];
        app.locals.category = listName.concat(list);
    });
})
.catch(err => console.log(err));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const shopRouter = require('./routes/shop');
const searchRouter = require('./routes/search')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/stylesheets',express.static(__dirname + 'public/stylesheets'));
app.use('/font',express.static(__dirname + 'public/font'));
app.use('/javascripts',express.static(__dirname + 'public/javascripts'));
app.use('/images',express.static(__dirname + 'public/images'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shop', shopRouter);
app.use('/search', searchRouter);

module.exports = app;