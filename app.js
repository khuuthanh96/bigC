const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ProductLines = require('./model/ProductLines');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

require('./startDatabase');
const initFakeDatabase = require('./lib/initFakeDatabase');
require('./lib/initAdminAccount');

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

const indexRouter = require('./controllers/index.routes');
const usersRouter = require('./controllers/users.route');
const shopRouter = require('./controllers/shop.route');
const searchRouter = require('./controllers/search.route');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "qweasdzxc",
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shop', shopRouter);
app.use('/search', searchRouter);

app.get('*', (req ,res) => res.render('page/404'));

module.exports = app;
