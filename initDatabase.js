const faker = require('faker');
const User = require('./model/User');
const ProductLines = require('./model/ProductLines')
const Product = require('./model/Product');
const Order = require('./model/Order');

async function initDatabase() {
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
        await ProductLines.createProductLines('T-shirt');
        await ProductLines.createProductLines('Shirt');
        await ProductLines.createProductLines('Sweater');
        await ProductLines.createProductLines('Trousers');
        await ProductLines.createProductLines('Hat');      
    }

    const productCount = await Product.count({});
    if(productCount < 30) {
        ProductLines.find()
        .then(productlines => {
            for (let index = 0; index < 10; index++) {
                const quantity = faker.random.number(50);
                const size = 'L';
                var price = faker.random.number(200000);
                Product.createProduct(productlines[0]._id.toString(), 'AOTHUN' + index, quantity, price, size);
                price = faker.random.number(500000);
                Product.createProduct(productlines[1]._id.toString(), 'SOMI' + index, quantity, price, size);
                price = faker.random.number(500000);
                Product.createProduct(productlines[2]._id.toString(), 'SWEATER' + index , quantity, price, size);
            }

            for (let index = 0; index < 10; index++) {
                const price = faker.random.number(800000);
                const quantity = faker.random.number(30);
                const size = '32';
                Product.createProduct(productlines[3]._id.toString(), 'QUAN' + index, quantity, price, size);
            }
        })

    }
    console.log('Init database finish!');
}

initDatabase();