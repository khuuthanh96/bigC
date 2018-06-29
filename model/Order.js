const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');

const orderSchema = mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    quantityOrdered: { type: Number, require: true },
    totalPrice: { type: Number },
    requiredDate: { type: Date, default: Date.now },
    shippedDate: { type: Date },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fee: { type: Number },
    deliveryMethod: { type: String },
    status: { type: String }
}, {
    timestamps: true 
});

const OrderModel = mongoose.model('Order', orderSchema);

class Order extends OrderModel {
    static async createOrder(products, quantityOrdered, totalPrice, customerId) {
        const order = new Order({products, quantityOrdered, totalPrice, customerId});
        await order.save()
        .catch(error => {
            throw new Error("dupplicate key!");
        })
    }
};

module.exports = Order;