const mongoose = require('mongoose');
const ProductLines = require('./ProductLines');

const productSchema = mongoose.Schema({
    productLines: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductLines' },
    name: { type: String, require: true },
    quantityInStock: { type: Number, require: true },
    price: { type: Number, require: true },
    description: { type: String },
    images: [{ type: String }],
    size: { type: String, require: true }
});

const ProductModel = mongoose.model('Product', productSchema);

class Product extends ProductModel {
    static async createProduct(productLines, name, quantityInStock, price, size, images, description) {
        const product = new Product({productLines, name, quantityInStock, price, size, images, description});
        await product.save()
    }

    static async removeProduct(idProduct) {
        const product = await Product.findByIdAndRemove(idProduct);
        if(!product) throw new Error("Can't find product");
        return product;
    }

    static async updateProduct(idProduct,productLines, name, quantityInStock, price, size, images, description) {
        await Product.findByIdAndUpdate(idProduct, {productLines, name, quantityInStock, price, size, images, description});
    }
};

module.exports = Product;