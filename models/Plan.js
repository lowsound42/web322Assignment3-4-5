/*  
  WEB322 Assignment 3/4/5
  Name: Omar Khan
  Student Number: 132197203
  Email: okhan27@myseneca.ca
  Section NCC
  Date: 29/6/2021
  Live demo: https://web322-final-omarkhan.herokuapp.com/
  github repo: https://github.com/lowsound42/web322Assignment3-4-5
  All the work in the project is my own except for stock photos, icons, and bootstrap files included

**The admin user credentials are:**
**email**: admin@hoster.ca
**password**: 123qwe123

**One sample customer user is:**
**email**: test@hoster.ca
**password**: 123qwe123
  */
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
