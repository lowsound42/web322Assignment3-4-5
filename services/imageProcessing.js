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

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: './static/photos/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('gif')
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload.single('PlanPicture');
