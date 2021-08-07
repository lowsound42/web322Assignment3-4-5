const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    address: String,
    password: String,
    phone: String,
    city: String,
    postal: String,
    addresstwo: { type: String, default: 'N/A' },
    province: String,
    company: { type: String, default: 'N/A' },
    admin: Boolean,
    cart: String
});

let User = mongoose.model('user', userSchema);

module.exports = User;
