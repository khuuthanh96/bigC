const mongoose = require('mongoose');

const productLinesSchema = mongoose.Schema({
    name: { type: String, require: true, trim: true, unique: true }
});

const ProductLinesModel = mongoose.model('ProductLines', productLinesSchema);

class ProductLines extends ProductLinesModel {
    static async createProductLines(name) {
        const productLines = new ProductLines({name});
        const error = productLines.validateSync();
        if(error) throw new Error('Product line info is invalid!');
        await productLines.save()
        .catch(error => {
            throw new Error(error);
        }) 
    }
};

module.exports = ProductLines;