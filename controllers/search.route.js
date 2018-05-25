const express = require('express');
const searchRouter = express.Router();
const Product = require('../model/Product');
const ProductLines = require('../model/ProductLines');

searchRouter.get('/', (req, res, next) => {
	res.redirect('/shop')
})

searchRouter.get('/:keyword', (req, res, next) => {
	const keyword = req.params.keyword
    res.redirect(`/search/all/${keyword}`);
});

searchRouter.get('/:productline/:keyword', async (req, res, next) => {
	const productline = req.params.productline
	const keyword = req.params.keyword
	var product_lines

	if (productline == 'all') {
		product_lines = await ProductLines.find().exec()
	}
	else {
		product_lines = await ProductLines.find({name : productline}).exec()
	}

	var products
	for (var line in product_lines) {
		products = await Product.find({ productLines : product_lines[line], name : {$regex:keyword}}).exec()

		for (var i in products) {
			console.log(products[i])
		}
	}
});

module.exports = searchRouter;