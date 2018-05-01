const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
    name: { type: String, require: true, trim: true, unique: true },
    phone: { type: String, trim: true },
    address: { type: String, require: true },
    email: { type: String, trim: true }
});

const SuppModel = mongoose.model('Supplier', supplierSchema);

class Supplier extends SuppModel {

}

module.exports = Supplier;