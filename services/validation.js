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
module.exports.logValidation = function (data) {
    let pError = false;
    let emailError = false;
    let formData;
    if (data) {
        formData = data;
    }
    const regPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (formData.password.length === 0) {
        pError = 'Please enter a password!';
    } else if (!regPass.test(formData.password)) {
        pError =
            'Your password should be at least 8 characters long and include at least one letter and one number';
    }
    if (formData.email.length === 0) {
        emailError = 'Please enter a username!';
    } else if (!regEmail.test(formData.email)) {
        emailError = 'Please enter a valid email address';
    }

    formData.emailError = emailError;
    formData.pError = pError;
    formData.registration = false;
    formData.login = true;
    return formData;
};

module.exports.regValidation = function (data) {
    let formData;
    let pError = false;
    let uError = false;
    let telError = false;
    let addError = false;
    let cityError = false;
    let provError = false;
    let postalError = false;
    let countryError = false;
    let emailError = false;
    if (data) {
        formData = data;
    }
    const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const regTel = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

    formData.addressone.length === 0
        ? (addError = 'Address cannot be empty')
        : (addError = false);
    formData.city.length === 0
        ? (cityError = 'City cannot be empty')
        : (cityError = false);
    formData.country.length === 0
        ? (countryError = 'Country cannot be empty')
        : (countryError = false);
    formData.postal.length === 0
        ? (postalError = 'Postal Code cannot be empty')
        : (postalError = false);

    formData.province.length === 0
        ? (provError = 'Province cannot be empty')
        : (provError = false);

    if (formData.pword.length === 0) {
        pError = 'Please enter a password!';
    } else if (!regPass.test(formData.pword)) {
        pError =
            'Your password should be at least 8 characters long and include at least one letter and one number';
    }

    if (formData.emailadd.length === 0) {
        emailError = 'Please enter an email address';
    } else if (!regEmail.test(formData.emailadd)) {
        emailError = 'Please enter a valid email address';
    }

    if (!regTel.test(formData.phone)) {
        telError =
            'Please enter a valid phone number (eg: 416.555.5555 or 416-555-5555 or 4165555555)';
    }

    if (formData.uname.length === 0) {
        uError = 'Please enter a username!';
    }

    formData.emailError = emailError;
    formData.pError = pError;
    formData.uError = uError;
    formData.telError = telError;
    formData.addError = addError;
    formData.uError = uError;
    formData.cityError = cityError;
    formData.countryError = countryError;
    formData.provError = provError;
    formData.postalError = postalError;
    formData.registration = true;
    formData.login = false;

    return formData;
};
