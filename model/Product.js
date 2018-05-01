const mongoose = require('mongoose');
const Supplier = require('./Suppliers');
const ProductLines = require('./ProductLines');

const productSchema = mongoose.Schema({
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    productLines: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductLines' },
    name: { type: String, require: true },
    quantityInStock: { type: Number, require: true },
    price: { type: Number, require: true },
    description: { type: String },
    images: [{ type: String , data: Buffer }]
});

const ProductModel = mongoose.model('Product', productSchema);

class Product extends ProductModel {

};

module.exports = Product;