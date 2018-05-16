const faker = require('faker');
const User = require('./model/User');
const ProductLines = require('./model/ProductLines')
const Product = require('./model/Product');
const Order = require('./model/Order');

const {imagesAothun, imagesQuan, imagesSomi, imagesNon, imagesSweater} = require('./imagesURL');

async function initDatabase() {
    try {
        const userCount = await User.count({});
        if( userCount < 30) {
            for (let index = 0; index < 30; index++) {
                const email = faker.internet.email();
                const name = faker.name.findName();
                const address = faker.address.streetAddress();            

                User.signUp(email, '123', name, address);
            }
        }
    
        const productLinesCount = await ProductLines.count({});
        if(productLinesCount < 4) {
            await ProductLines.createProductLines('tshirt');
            await ProductLines.createProductLines('shirt');
            await ProductLines.createProductLines('sweater');
            await ProductLines.createProductLines('trousers');
            await ProductLines.createProductLines('hat');      
        }

        const productCount = await Product.count({});
        if(productCount < 5) {
            ProductLines.find()
            .then(productlines => {
                for (let index = 0; index < 5; index++) {
                    const quantity = faker.random.number(50);
                    const size = 'L';
                    var price = faker.random.number(200000);
                    Product.createProduct(productlines[0]._id.toString(), 'AOTHUN ' + index, quantity, price, size, imagesAothun[index]);
                    price = faker.random.number(500000);
                    Product.createProduct(productlines[1]._id.toString(), 'SOMI ' + index, quantity, price, size, imagesSomi[index]);
                    price = faker.random.number(500000);
                    Product.createProduct(productlines[2]._id.toString(), 'SWEATER ' + index , quantity, price, size, imagesSweater[index]);
                }

                for (let index = 0; index < 5; index++) {
                    const price = faker.random.number(800000);
                    const quantity = faker.random.number(30);
                    const size = '32';
                    Product.createProduct(productlines[3]._id.toString(), 'QUAN ' + index, quantity, price, size, imagesQuan[index]);
                }

                for (let index = 0; index < 3; index++) {
                    const price = faker.random.number(200000);
                    const quantity = faker.random.number(30);
                    const size = 'non-size'
                    Product.createProduct(productlines[4]._id.toString(), 'NON ' + index, quantity, price, size, imagesNon[index]);
                }
            })
        }
        return Promise.resolve(ProductLines);
    } catch(err) {
        return Promise.reject(err);
    }
}

module.exports = initDatabase;