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
    }

    static async removeProductLines(idProductLines) {
        const productLines = await ProductLines.findByIdAndRemove(idProductLines);
        if(!productLines) throw new Error("Can't find productlines");
        return productLines;
    }

    static async updateProductLines(idProductLines, name) {
        await ProductLines.findByIdAndUpdate(idProductLines, {name});
    } 
};

module.exports = ProductLines;