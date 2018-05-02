const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
    name: { type: String, require: true, trim: true, unique: true },
    phone: { type: String, trim: true, require: true },
    address: { type: String, require: true },
    email: { type: String, trim: true, require: true }
});

const SuppModel = mongoose.model('Suppliers', supplierSchema);

class Suppliers extends SuppModel {
    static async createSupplier(name, phone, address, email) {
        const supplier = new Suppliers({name, phone, address, email});
        const error = supplier.validateSync();
        if(error) throw new Error('Suppliers info is invalid!');
        await supplier.save()
        .catch(error => {
            throw new Error(error);
        }) 
    }
}

module.exports = Suppliers;