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

let router = require('express').Router();
var validation = require('../services/validation');
const upload = require('../services/imageProcessing');
let User = require('../models/User');
const path = require('path');
const fs = require('fs');
let Plan = require('../models/Plan');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const clientSessions = require('client-sessions');
var mongoose = require('mongoose');

router.use(
    clientSessions({
        cookieName: 'session', // this is the object name that will be added to 'req'
        secret: 'hosterShmoster6524', // this should be a long un-guessable string.
        duration: 30 * 60 * 1000, // duration of the session in milliseconds (30 minutes)
        activeDuration: 2 * 1000 * 60 // the session will be extended by this many ms each request (2 minute)
    })
);

function ensureLogin(req, res, next) {
    User.findOne({ email: req.session.email })
        .exec()
        .then((user) => {
            if (req.session.email && user) {
                next();
            } else {
                res.redirect('/');
            }
        });
}

router.post('/finalCheckout', (req, res) => {
    User.updateOne(
        { _id: req.session.id },
        { $push: { orders: req.body.data } },
        function (err, result) {
            if (err) {
            } else {
            }
        }
    );
    res.json({ success: true });
});

router.get('/orders', (req, res) => {
    User.findOne({ _id: req.session.id })
        .lean()
        .exec()
        .then((response) => {
            res.json(response);
        });
});

router.get('/', (req, res) => {
    const page = { home: true };
    res.render('index', {
        layout: req.session.email ? 'mainLogged' : 'main',
        page: page,
        customer: req.session.customer
    });
});

function getPrice(input) {
    let removeExtras = input.slice(2).slice(0, -3);
    return parseFloat(removeExtras);
}

router.post('/plan', (req, res) => {
    Plan.findOne({
        _id: mongoose.Types.ObjectId(req.body.id)
    })
        .lean()
        .exec()
        .then((response) => {
            res.json(response);
        });
});

router.get('/cart', (req, res) => {
    const page = { cart: true };
    if (req.session.email) {
        let tempCart = req.session.cart;
        User.findOne({ _id: req.session.id })
            .lean()
            .exec()
            .then((response) => {
                if (response.cart.planId !== null) {
                    Plan.findOne({
                        _id: mongoose.Types.ObjectId(response.cart.planId)
                    })
                        .lean()
                        .exec()
                        .then((response) => {
                            let priceBase =
                                (getPrice(response.price) * 100) / 57;
                            tempCart = {
                                plan: response,
                                price: (
                                    priceBase -
                                    (43 / 100) * priceBase
                                ).toFixed(2),
                                one: priceBase.toFixed(2),
                                twelve: (
                                    priceBase -
                                    (37 / 100) * priceBase
                                ).toFixed(2),
                                twentyFour: (
                                    priceBase -
                                    (40 / 100) * priceBase
                                ).toFixed(2)
                            };
                        })
                        .then((result) => {
                            res.render('cart', {
                                page: page,
                                cart: tempCart,
                                tempCart: tempCart,
                                id: tempCart.plan._id,
                                layout: 'mainLogged',
                                customer: req.session.customer
                            });
                        });
                } else {
                    res.render('cart', {
                        page: page,
                        cart: true,
                        layout: 'mainLogged',
                        customer: req.session.customer
                    });
                }
            });
    } else {
        res.redirect('/');
    }
});

router.post('/addToCart', (req, res) => {
    User.updateOne(
        { email: req.session.email },
        { $set: { cart: { planId: req.body.id } } },
        function (err, result) {
            if (err) {
            } else {
            }
        }
    );
    res.json(req.session.cart);
});

router.get('/planData', (req, res) => {
    Plan.find()
        .lean()
        .exec()
        .then((response) => {
            res.send(response);
        });
});

router.patch('/cart/:id', (req, res) => {
    User.updateOne(
        { email: req.session.email },
        { $set: { cart: { planId: null } } },
        function (err, result) {
            if (err) {
            } else {
                res.json({ message: 'cart updated' });
            }
        }
    );
});

router.delete('/plans/:id', (req, res) => {
    Plan.deleteOne({ _id: req.params.id.substr(1) }, function (err) {
        if (err) {
            return handleError(err);
        } else {
            res.send({ message: 'deleted' });
        }
    });
});

router.patch('/plans/:id', (req, res) => {
    const filter = { _id: req.params.id.substr(1) };

    const update = { chosenOne: true };

    Plan.updateOne(
        { chosenOne: true },
        { $set: { chosenOne: false } },
        function (err, result) {
            if (err) {
            } else {
                Plan.updateOne(
                    { _id: req.params.id.substr(1) },
                    { chosenOne: true }
                )
                    .lean()
                    .exec()
                    .then((response) => {
                        res.send(response);
                    });
            }
        }
    );
});

router.get('/plans', (req, res) => {
    let customerSesh = false;
    let adminSesh = false;
    let noUser = true;

    if (req.session.email) {
        if (req.session.admin) {
            adminSesh = true;
            noUser = false;
            customerSesh = false;
        } else {
            customerSesh = true;
            noUser = false;
            adminSesh = false;
        }
    }
    let imgArray = [];
    let dataArray = [];
    Plan.find()
        .lean()
        .exec()
        .then((response) => {
            dataArray = response;
            let newArray = dataArray.map((obj) => ({
                ...obj,
                image: {
                    contentType: obj.img.contentType,
                    data: obj.img.data.toString('base64')
                }
            }));
            const page = { plan: true };
            if (req.session.email) {
                res.render('plans', {
                    layout: 'mainLogged',
                    data: newArray,
                    page: page,
                    adminSesh: adminSesh,
                    noUser: noUser,
                    customerSesh: customerSesh,
                    cart: req.session.cart,
                    customer: req.session.customer
                });
            } else {
                let newArray = dataArray.map((obj) => ({
                    ...obj,
                    image: {
                        contentType: obj.img.contentType,
                        data: obj.img.data.toString('base64')
                    }
                }));
                res.render('plans', {
                    data: newArray,
                    page: page,
                    customerSesh: customerSesh,
                    adminSesh: adminSesh,
                    noUser: noUser
                });
            }
        });
});

router.post('/editPlan', upload, (req, res) => {
    let priceStr = String(req.body.price);

    let tempArray = [];
    JSON.parse(req.body.items).forEach((element) => {
        tempArray.push(element);
    });
    if (req.file !== undefined) {
        var newPlan = new Plan({
            title: req.body.title,
            description: req.body.description,
            price: `C$${priceStr}/mo`,
            items: tempArray,
            img: {
                data: fs.readFileSync(
                    path.join('./static/photos/' + req.file.filename)
                ),
                contentType: req.file.mimetype
            },
            chosenOne: false
        });
        if (
            newPlan.title.length > 0 &&
            newPlan.description.length > 0 &&
            newPlan.price.length > 0 &&
            newPlan.items.length > 0
        ) {
            Plan.deleteOne({ _id: req.body._id })
                .lean()
                .exec()
                .then((response) => {
                    newPlan.save((err) => {
                        if (err) {
                            res.send({ error: 'Error saving the plan' });
                        } else {
                            res.send({ success: 'Plan saved!' });
                        }
                    });
                });
        } else res.send({ validError: 'Enter all data' });
    } else {
        res.send({ picError: 'Image must be correct format' });
    }
});

router.get('/userDetails', (req, res) => {
    if (req.session.customer) {
        User.findOne({ _id: req.session.id })
            .lean()
            .exec()
            .then((response) => {
                if (response.cart.planId) {
                    Plan.findOne({
                        _id: mongoose.Types.ObjectId(response.cart.planId)
                    })
                        .lean()
                        .exec()
                        .then((response) => res.send(response));
                } else {
                    res.send({ message: 'nothing to report' });
                }
            });
    }
});

router.post('/uploadPlan', upload, (req, res) => {
    Plan.countDocuments({}, function (err, count) {
        if (count < 6) {
            let priceStr = String(req.body.price);

            let tempArray = [];
            JSON.parse(req.body.items).forEach((element) => {
                tempArray.push(element);
            });
            if (req.file !== undefined) {
                var newPlan = new Plan({
                    title: req.body.title,
                    description: req.body.description,
                    price: `C$${priceStr}/mo`,
                    items: tempArray,
                    img: {
                        data: fs.readFileSync(
                            path.join('./static/photos/' + req.file.filename)
                        ),
                        contentType: req.file.mimetype
                    },
                    chosenOne: false
                });
                if (
                    newPlan.title.length > 0 &&
                    newPlan.description.length > 0 &&
                    newPlan.price.length > 0 &&
                    newPlan.items.length > 0
                ) {
                    Plan.exists(
                        { title: newPlan.title },
                        function (error, doc) {
                            if (doc) {
                                res.send({ exists: 'the plan already exists' });
                            } else {
                                newPlan.save((err) => {
                                    if (err) {
                                        res.send({
                                            error: 'Error saving the plan'
                                        });
                                    } else {
                                        res.send({ success: 'Plan saved!' });
                                    }
                                });
                            }
                        }
                    );
                } else res.send({ validError: 'Enter all data' });
            } else {
                res.send({ picError: 'Image must be correct format' });
            }
        } else {
            res.send({ limit: 'You cannot add more than 6 plans' });
        }
    });
});

router.get('/login', (req, res) => {
    if (req.session.email) {
        res.redirect('/dashboard');
    }
    const page = { login: true };
    res.render('login', {
        page: page,
        layout: 'form'
    });
});

router.get('/registration', (req, res) => {
    if (req.session.email) {
        res.redirect('/dashboard');
    }
    const page = { registration: true };
    res.render('registration', {
        page: page,
        layout: 'form'
    });
});

router.post('/login', (req, res) => {
    let formData = validation.logValidation(req.body);

    const dbError = { loginError: true };
    if (
        formData.password.length > 0 &&
        formData.pError === false &&
        formData.emailError === false
    ) {
        const sesh = req.session;
        User.findOne({ email: formData.email })
            .exec()
            .then((user) => {
                if (user) {
                    bcrypt.compare(
                        formData.password,
                        user.password,
                        function (err, response) {
                            let userCart = false;
                            if (response) {
                                req.session = {
                                    id: user._id,
                                    firstName: user.firstname,
                                    lastName: user.lastName,
                                    admin: user.admin,
                                    cart: user.admin ? false : user.cart.planId,
                                    customer: user.customer,
                                    page: { dashboard: true },
                                    layout: 'mainLogged',
                                    email: user.email,
                                    origin: 1
                                };
                                res.redirect('/dashboard');
                            } else {
                                res.render('login', {
                                    data: formData,
                                    dbError: dbError,
                                    page: { login: true },
                                    layout: 'form'
                                });
                            }
                        }
                    );
                } else {
                    const dbError = { noUserError: true };

                    res.render('login', {
                        data: formData,
                        dbError: dbError,
                        page: { login: true },
                        layout: 'form'
                    });
                }
            });
    } else {
        res.render('login', {
            data: formData,
            layout: 'form'
        });
    }
});

router.get('/dashboard', ensureLogin, (req, res) => {
    if (req.session.admin) {
        res.render('adminDashboard', {
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            id: req.session.id,
            email: req.session.email,
            page: req.session.page,
            layout: req.session.layout,
            cart: req.session.cart,
            customer: req.session.customer
        });
    } else {
        res.render('dashboard', {
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            id: req.session.id,
            email: req.session.email,
            page: req.session.page,
            layout: req.session.layout,
            cart: req.session.cart,
            customer: req.session.customer
        });
    }
});

router.post('/registration', (req, res) => {
    let formData = validation.regValidation(req.body);
    if (
        formData.pword.length > 0 &&
        formData.pError === false &&
        formData.uError === false &&
        formData.emailError === false &&
        formData.telError === false &&
        formData.addError === false &&
        formData.cityError === false &&
        formData.countryError === false &&
        formData.provError === false &&
        formData.postalError === false
    ) {
        bcrypt.hash(formData.pword, saltRounds, (err, hash) => {
            let userInfo = new User({
                username: formData.uname,
                firstname: formData.fname,
                lastname: formData.lname,
                email: formData.emailadd,
                address: formData.addressone,
                password: hash,
                phone: formData.phone,
                city: formData.city,
                postal: formData.postal,
                addresstwo: formData.addresstwo,
                province: formData.province,
                company: formData.company,
                admin: false,
                customer: true,
                cart: { planId: null },
                orders: []
            });
            userInfo.save((err, userNew) => {
                if (err) {
                    res.render('registration', {
                        data: formData,
                        dbError: { regError: true },
                        layout: 'form'
                    });
                } else {
                    req.session = {
                        id: userNew._id,
                        customer: true,
                        username: formData.uname,
                        firstName: formData.fname,
                        lastName: formData.lname,
                        admin: false,
                        cart: null,
                        page: { dashboard: true },
                        layout: 'mainLogged',
                        origin: 2,
                        email: formData.emailadd
                    };

                    res.redirect('dashboard');
                }
            });
        });
    } else {
        res.render('registration', {
            data: formData,
            layout: 'form'
        });
    }
});

router.get('/logout', function (req, res) {
    req.session.reset();
    res.redirect('/login');
});

module.exports = router;
