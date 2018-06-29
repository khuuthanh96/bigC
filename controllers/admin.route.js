const express = require('express');
const fs = require('fs')
const adminRouter = express.Router();
const {rolesAuthorized, isLoggedIn} = require('../lib/auth.middleware');

const User = require('../model/User');
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');
const Order = require('../model/Order');

const passport = require('passport');
const uploadConfig = require('../lib/uploadImageConfig');
const uploadImage = uploadConfig.single('image')

/* GET users listing. */
adminRouter.get('/', (req, res) => {
  res.redirect('/admin/login');
});

adminRouter.get('/login', (req, res, next) => {
  if(req.isAuthenticated()) return res.redirect('/admin/products')
  res.render('admin/login', {user: req.user, error: req.flash('error')});
});

adminRouter.post('/login',passport.authenticate('local', {
  failureRedirect: '/admin/login',
  successRedirect: '/admin/products',
  failureFlash: 'Invalid username or password.'
}));

adminRouter.get('/logout',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    req.logOut();
    req.destroy();
    res.redirect('/admin/login');
})

adminRouter.get('/products',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    Product.find()
    .then(listProducts => {
      res.render('admin/products', {listProducts, user: req.user});
    })
});

adminRouter.get('/editproduct/:idProduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    const idProduct = req.params.idProduct;
    Product.findById(idProduct)
    .then(async (productInfo) => {
      const prodL = await ProductLines.findById(productInfo.productLines);
      console.log(prodL);
      res.render('admin/editproduct', {productInfo, prodLName: prodL.name, user: req.user});
    })
    .catch(err => console.log(err));
});

adminRouter.post('/editproduct/:idProduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    uploadImage(req, res, async (err) => {
      if(err) return res.send(err);
      const idProduct = req.params.idProduct;
      const info = req.body;
      const prodL = await ProductLines.findOne({name: info.productLines});

      Product.findByIdAndUpdate(idProduct, { 
        name: info.name, 
        price: info.price,
        productLines: prodL._id,
        quantityInStock: info.quantity,
        size: info.size,
        status: info.status,
        description: info.description
      })
      .then(() => {
        if(req.file) {
          Product.findByIdAndUpdate(idProduct, {$push: { images: req.file.filename }})
          .then(() => res.redirect('/admin/products'))
          
        }
        res.redirect('/admin/products')
      })
      .catch(err => console.log(err));
    })
});

adminRouter.get('/deleteproduct/:idProduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    const idProduct = req.params.idProduct;
    Product.findByIdAndRemove(idProduct)
    .then(p => {
      p.images.forEach(img => {
        fs.unlinkSync(`./public/images/shop/${img}`)
      })
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
});

adminRouter.get('/addproduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']), 
  (req, res) => {
    res.render("admin/addproduct", { user: req.user });
});

adminRouter.post('/addproduct',
  isLoggedIn, 
  rolesAuthorized(['admin', 'staff']),
  (req, res) => {
    uploadImage(req, res, async (err) => {
      if(err) return res.send(err);
      const info = req.body;

      const prodL = await ProductLines.findOne({name: info.productLines});

      const product = new Product({ 
        name: info.name, 
        price: info.price,
        productLines: prodL._id,
        quantityInStock: info.quantity,
        size: info.size,
        status: info.status,
        description: info.description
      });
      const p = await product.save();

      if(req.file) {
        Product.findByIdAndUpdate(p._id, {$push: { images: req.file.filename }})
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
      }
      res.redirect('/admin/products')
 
    })
});

adminRouter.get('/showuser',
  isLoggedIn, 
  rolesAuthorized(['admin']), 
  (req, res) => {
    User.find()
    .then(listUser => {
      for (let i = 0; i < listUser.length; i++) {
        if(listUser[i].roles === "admin") {
          listUser.splice(i, 1);
        } 
      }
      res.render("admin/user", {listUser, user: req.user, msg: req.flash('msg'), error: req.flash('error')});
    })
    .catch(err => console.log(err));
});

adminRouter.get('/orders',
  isLoggedIn,
  rolesAuthorized(['admin', 'staff']),
  (req, res) => {
    res.render("admin/orders", { user: req.user });
  }
)

adminRouter.get('/editorder', 
  isLoggedIn,
  rolesAuthorized(['admin']),
  (req, res) => {
    res.render("admin/order-detail", {user: req.user});
  }
)

adminRouter.get('/manageCategories', 
  isLoggedIn,
  rolesAuthorized(['admin', 'staff']),
  (req, res) => {
    res.render('admin/manageCategories', {user: req.user})
  }
)

adminRouter.get('/deleteuser/:id', 
  isLoggedIn,
  rolesAuthorized(['admin']),
  (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
    .then(user => {
      req.flash('msg', `Deleted succesfully user: ${user.name} - id: ${user._id} has been deleted!`);
      res.redirect('/admin/showuser');
    })
  }
)

adminRouter.post('/adduser', 
  isLoggedIn,
  rolesAuthorized(['admin']),
  (req, res) => {
    const {email, name, phone, sex, birthday, password,rePassword, address, role} = req.body;

    if(password !== rePassword){
      req.flash('error', 'Password and re-password is not the same');
      res.redirect('/admin/showuser');
    }
    User.findOne({email}) 
    .then(userExisting => {
        if(userExisting) {
            req.flash('error', 'Email in use!!!');
            res.redirect('/admin/showuser');
        };
        
        return User.signUp(email, password,name,address,phone,sex,birthday);
    })
    .then(async (user) => {
        if(!user) {
          req.flash('error', 'Email in use');
          res.redirect('/admin/showuser');
        } 
        if(role === 'Staff') {
          await User.setRoles(user._id, 'staff');
        }
        User.setActive(user._id)
        .then(_ => {
          res.redirect('/admin/showuser')
        });
    })
    .catch(err => {
      req.flash('error', "phone is longer than the maximum allowed length (12)"),
      res.redirect('/admin/showuser');
    })
  }
)

module.exports = adminRouter;
