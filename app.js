const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ProductLines = require('./model/ProductLines');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportService = require('./lib/passport');
const flash = require('connect-flash')
const mongoStore = require('connect-mongo')(session)

const getDbUri = require('./startDatabase'); //connect to database
const createCategory = require('./lib/initDefaultCategory'); // create default category
require('./lib/initAdminAccount'); // create admin account for managed

const app = express();

// createCategory()
// .then(_ => {
//     ProductLines.find()
//     .then(list => {
//         let listName = [];
//         app.locals.category = listName.concat(list);
//     })
// })

const indexRouter = require('./controllers/index.routes');
const adminRouter = require('./controllers/admin.route');
const shopRouter = require('./controllers/shop.route');
const userRouter = require('./controllers/user.route');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: "sdadknxzvcnlker",
    cookie:{
        expires: 1000*60*60*24*2
    },
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: getDbUri(),
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.session = req.session;
    createCategory()
    .then(_ => {
        ProductLines.find()
        .then(list => {
            let listName = [];
            res.locals.category = listName.concat(list);
        })
    })

    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/shop', shopRouter);
app.use('/user', userRouter);

app.get('*', (req ,res) => res.render('page/404'));

console.log("Server listening")
module.exports = app;
