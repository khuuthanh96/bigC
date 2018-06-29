const express = require('express');
const shopRouter = express.Router();
const Product = require('../model/Product');
const Order = require('../model/Order');
const ProductLines = require('../model/ProductLines');
const {rolesAuthorized, isUserLoggedIn, isActiveAccount} = require('../lib/auth.middleware');
const Cart = require('../model/Cart');
/* GET shop page. */
shopRouter.get('/', (req, res) => {
    res.redirect('/shop/tshirt/1');    
});

shopRouter.get('/cart', (req, res) => {
    let emptyCart = new Cart({});
    res.render('page/cart', {isLogin: req.isAuthenticated(), cart: req.session.cart ? req.session.cart : cart, user: req.user });
});

shopRouter.get('/add-to-cart/:id', (req, res) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart.items : {});
    
    Product.findById(productId)
    .then(product => {
        cart.add(product, product._id);
        req.session.cart = cart;
        res.redirect('/');
    }) 
});

shopRouter.get('/cart-delete-item/:id', (req, res) => {
    const id = req.params.id;
    req.session.cart.totalQty -= req.session.cart.items[id].qty;
    req.session.cart.totalPrice -= req.session.cart.items[id].price;
    delete req.session.cart.items[id];
    res.redirect('/shop/cart');
})

shopRouter.get('/product/:id', (req, res) => {
    Product.findById(req.params.id)
    .then(product => {
        res.render('page/productDetails', { product, isLogin: req.isAuthenticated(), user: req.user });
    })
});

shopRouter.get('/add-in-cart/:id', (req, res) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart.items : {});
    
    Product.findById(productId)
    .then(product => {
        cart.add(product, product._id);
        req.session.cart = cart;
        res.redirect('/shop/cart');
    }) 
})

shopRouter.get('/delete-in-cart/:id', (req, res) => {
    const id = req.params.id;
    req.session.cart.totalQty -= 1;
    req.session.cart.items[id].qty -= 1;
    req.session.cart.items[id].price -= req.session.cart.items[id].item.price;
    req.session.cart.totalPrice -= req.session.cart.items[id].item.price;
    if(req.session.cart.items[id].qty == 0){
        delete req.session.cart.items[id];
    }
    res.redirect('/shop/cart');
})

shopRouter.get('/checkout', 
    isUserLoggedIn,
    isActiveAccount,
    (req, res) => {
 
    res.render('page/checkout', {
        isLogin: req.isAuthenticated(),
        user: req.user,
        cart: req.session.cart
    });
});

shopRouter.post('/checkout',
    isUserLoggedIn,
    isActiveAccount,
    (req, res) => {
    const { delivery, payment, name, address, phone } = req.body;
    let itemsOrdered = [{}];
    for(let i in req.session.cart.items) {
        let objItem = {
            produtcts: i,
            qty: req.session.cart.items[i].qty
        }
        itemsOrdered.push(objItem);
    }
    let now = new Date();
    let fee;
    shippedDate = new Date();
    if(delivery === 'fast') {
        shippedDate.setDate(shippedDate.getDate() + 2);
        fee = 40000;
    }else {
        shippedDate.setDate(shippedDate.getDate() + 4);
        fee = 20000;
    }
    

    Order.createOrder(
        itemsOrdered,
        req.session.cart.totalQty,
        req.session.cart.totalPrice,
        req.user._id,
        delivery,
        payment,
        name,
        address,
        phone,
        fee,
        shippedDate
    ).then( order => {
        req.flash('msg', `Order successfully: Your order ID: ${order._id}`);
        res.redirect('/shop');
    })
    .catch(err => {
        req.flash('error', 'Order failure!')
        res.redirect('/shop');
    })
})

shopRouter.get('/:productline', (req, res) => {
    const productline = req.params.productline;
    res.redirect(`/shop/${productline}/1`);
});

shopRouter.get('/:productline/:page', (req, res) => {
    const perPage = 9;
    const page = req.params.page || 1;
    const productline = req.params.productline;
    ProductLines.find({ name: productline })
    .then(productLine => {
        return Product.find({ productLines: productLine[0]._id })
        .limit(perPage)
        .skip((perPage * page) - perPage)
    })
    .then(products => {
        if(products.length === 0) return res.render('page/shop', {
            products,
            current: page,
            pages: Math.ceil(1 / perPage),
            productlines: productline,
            isLogin: req.isAuthenticated(),
            user: req.user,
            msg: req.flash('msg'),
            error: req.flash('error')
        })
        Product.count({ productLines: products[0].productLines })
        .then(length => {
            res.render('page/shop', {
                products,
                current: page,
                pages: Math.ceil(length / perPage),
                productlines: productline,
                isLogin: req.isAuthenticated(),
                user: req.user,
                msg: req.flash('msg'),
                error: req.flash('error')
            })
        })
    })
});


module.exports = shopRouter;
