const mongoose = require('mongoose');
const ProductLines = require('./ProductLines');

const productSchema = mongoose.Schema({
    productLines: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductLines' },
    name: { type: String, require: true },
    quantityInStock: { type: Number, require: true },
    price: { type: Number, require: true },
    description: { type: String },
    images: [{ type: String , data: Buffer }],
    size: { type: String, require: true }
});

const ProductModel = mongoose.model('Product', productSchema);

class Product extends ProductModel {
    static async createProduct(productLines, name, quantityInStock, price, size) {
        const product = new Product({productLines, name, quantityInStock, price, size});
        await product.save()
        .catch(error => {
            throw new Error('dupplicate key!');
        })
    }
};

module.exports = Product;