const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    title: String,
    description: String,
    price: String,
    items: Array
});

let Plan = mongoose.model('plan', planSchema);

module.exports = Plan;
