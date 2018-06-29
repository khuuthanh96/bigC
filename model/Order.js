const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');

const orderSchema = mongoose.Schema({
    items: [{
        products: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        qty: {type: String}
    }],
    quantityOrdered: { type: Number, require: true },
    totalPrice: { type: Number },
    requiredDate: { type: Date, default: Date.now },
    shippedDate: { type: Date },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    fee: {type: Number},
    delivery: {type: String, require: true},
    payment: {type:String, require: true},
    phone: {type: String, require: true},
    address:{type:String, require: true},
    name: {type: String}
});

const OrderModel = mongoose.model('Order', orderSchema);

class Order extends OrderModel {
    static async createOrder(items, quantityOrdered, totalPrice, customerId, delivery, payment, name, address, phone, fee, shippedDate) {
        const order = new Order({items, quantityOrdered, totalPrice, customerId, delivery, payment, name, address, phone, fee, shippedDate});
        return await order.save()
        .catch(error => {
            throw new Error(error);
        })
    }
};

module.exports = Order;