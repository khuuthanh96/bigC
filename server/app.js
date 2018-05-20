const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ProductLines = require('./model/ProductLines');

require('./startDatabase');
const initFakeDatabase = require('./lib/initFakeDatabase');
initFakeDatabase()
.then(msg => {
    console.log(msg);
    return ProductLines.find()
})
.then(list => {
    let listName = [];
    app.locals.category = listName.concat(list);
})
.catch(err => console.log(err));

const indexRouter = require('./controllers/index');
const usersRouter = require('./controllers/users');
const shopRouter = require('./controllers/shop');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shop', shopRouter);

app.get('*', (req ,res) => res.render('page/404'));

module.exports = app;
