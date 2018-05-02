const faker = require('faker');
const User = require('./model/User');
const Suppliers = require('./model/Suppliers');
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

            await User.signUp(email, '123', name, address);
        }
    }
   
    const supplierCount = await Suppliers.count({});
    if(supplierCount < 10) {
        for (let index = 0; index < 10; index++) {
            const companyName = faker.company.companyName();
            const phone = faker.phone.phoneNumber();
            const address = faker.address.streetAddress();
            const email = faker.internet.email();
            
            await Suppliers.createSupplier(companyName, phone, address, email);
        }
    }

    const productLinesCount = await ProductLines.count({});
    if(productLinesCount < 4) {
        await ProductLines.createProductLines('Milk');
        await ProductLines.createProductLines('Drinks');
        await ProductLines.createProductLines('Instand Food');
        await ProductLines.createProductLines('Clothes');      
    }

    const productCount = await Product.count({});
    if(productCount < 20) {
        const suppId = "5ae96dd3bf9f590d8a0851f9";
        const productLine = "5ae96dd3bf9f590d8a0896f2";

        for (let index = 0; index < 20; index++) {
            const productName = faker.commerce.productName();
            const price = faker.random.number();
            const quantity = faker.random.number();
 
            await Product.createProduct(suppId, productLine, productName, quantity, price);
        }
    }

    const orderCount = await Order.count({});
    if(orderCount < 10) {
        const listProducts = ["5ae9be8d558f7c112d1c503b", "5ae9be8d558f7c112d1c092b", "5ae9be8d558f7c112d1c599b"];
        const customerId = "5ae96dd3bf9f590d8a08520d";

        for (let index = 0; index < 10; index++) {
            const totalPrice = faker.commerce.price();
            
            await Order.createOrder(listProducts, listProducts.count, totalPrice, customerId);
        }
    }

    console.log('Init database finish!');
}

initDatabase();