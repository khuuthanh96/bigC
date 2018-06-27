const ProductLines = require('../model/ProductLines')

async function initDefaultCategory() {
    try {
        const productLinesCount = await ProductLines.count({});
        if(productLinesCount < 1) {
            await ProductLines.createProductLines('tshirt');
            await ProductLines.createProductLines('shirt');
            await ProductLines.createProductLines('sweater');
            await ProductLines.createProductLines('trousers');
            await ProductLines.createProductLines('hat');      
        }
        return Promise.resolve("success");
    } catch(err) {
        return Promise.reject(err);
    }
}

module.exports = initDefaultCategory;