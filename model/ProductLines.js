const mongoose = require('mongoose');

const productLinesSchema = mongoose.Schema({
    name: { type: String, require: true, trim: true }
});

const ProductLinesModel = mongoose.model('Product', productLinesSchema);

class ProductLines extends ProductLinesModel {

};

module.exports = ProductLines;