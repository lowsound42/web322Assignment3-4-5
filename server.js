/* 
  WEB322 Assignment 2
  Name: Omar Khan
  Student Number: 132197203
  Email: okhan27@myseneca.ca
  Section NCC
  Date: 29/06/2021
  All the work in the project is my own except for stock photos, icons, and bootstrap files included
  Live demo: https://web322-a2-omar-khan.herokuapp.com/
  github repo: https://github.com/lowsound42/web322a2
  */

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
require('dotenv').config();
const db = process.env.mongoCreds;

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let apiRoutes = require('./routes/routes');

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

app.use('/', apiRoutes);

app.use((req, res, next) => {
    res.render('404', {
        layout: false
    });
});

app.listen(port, () => {
    console.log('Server is live at port:', port);
});
