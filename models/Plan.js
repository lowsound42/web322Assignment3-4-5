const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    title: { type: String, unique: true },
    description: String,
    price: String,
    items: Array,
    img: {
        data: Buffer,
        contentType: String
    },
    chosenOne: Boolean
});

let Plan = mongoose.model('plan', planSchema);

module.exports = Plan;
