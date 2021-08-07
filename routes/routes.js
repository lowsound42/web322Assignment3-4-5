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
        duration: 60 * 60 * 1000, // duration of the session in milliseconds (5 minutes)
        activeDuration: 2 * 1000 * 60 // the session will be extended by this many ms each request (1 minute)
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

router.get('/', (req, res) => {
    let sesh = { sesh: false };
    if (req.session.email) {
        sesh.sesh = true;
    }
    const page = { home: true };
    res.render('index', {
        page: page,
        sesh: sesh,
        cart: req.session.cart,
        layout: req.session.email ? 'mainLogged' : 'main'
    });
});

router.get('/cart', (req, res) => {
    let sesh = { sesh: false };
    if (req.session.email) {
        sesh.sesh = true;
    }
    const page = { cart: true };
    res.render('cart', {
        page: page,
        sesh: sesh,
        cart: req.session.cart,
        data: req.session.data,
        layout: 'mainLogged'
    });
});

router.post('/addToCart', (req, res) => {
    console.log(req.body.id);
    User.updateOne(
        { email: req.session.email },
        { $set: { cart: req.body.id } },
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('Cart updated!');
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

router.delete('/plans/:id', (req, res) => {
    console.log(req.params.id.substr(1));
    Plan.deleteOne({ _id: req.params.id.substr(1) }, function (err) {
        if (err) {
            return handleError(err);
        } else {
            console.log('deleted!');
        }
    });
});

router.patch('/plans/:id', (req, res) => {
    const filter = { _id: req.params.id.substr(1) };
    console.log('filter:', filter);
    const update = { chosenOne: true };
    console.log(req.params);
    Plan.updateOne(
        { chosenOne: true },
        { $set: { chosenOne: false } },
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                Plan.updateOne(
                    { _id: req.params.id.substr(1) },
                    { chosenOne: true }
                )
                    .lean()
                    .exec()
                    .then((response) => {
                        console.log(response);
                        res.send(response);
                    });
            }
        }
    );
});

router.get('/plans', (req, res) => {
    let sesh = { sesh: false };
    let adminSesh = { adminSesh: false };
    let noUser = { noUser: true };
    console.log(req.session.admin);
    if (req.session.email) {
        if (req.session.admin) {
            adminSesh.adminSesh = true;
            noUser.noUser = false;
        } else {
            sesh.sesh = true;
            noUser.noUser = false;
        }
    }
    Plan.find()
        .lean()
        .exec()
        .then((response) => {
            const page = { plan: true };
            if (req.session.email) {
                res.render('plans', {
                    layout: 'mainLogged',
                    data: response,
                    page: page,
                    sesh: sesh,
                    adminSesh: adminSesh,
                    noUser: noUser,
                    cart: req.session.cart
                });
            } else {
                res.render('plans', {
                    data: response,
                    page: page,
                    sesh: sesh,
                    noUser: noUser
                });
            }
        });
});

router.post('/editPlan', upload, (req, res) => {
    let priceStr = String(req.body.price);
    console.log(req.body);
    let tempArray = [];
    JSON.parse(req.body.items).forEach((element) => {
        tempArray.push(element);
    });
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
                console.log(response);
                newPlan.save((err) => {
                    if (err) {
                        console.log('Error saving the plan');
                    } else {
                        console.log('Plan saved!');
                    }
                });
            });
    } else {
        console.log('no data');
    }
    res.redirect('/dashboard');
});

router.get('/userDetails', (req, res) => {
    console.log(req.session.data._id);
    if (!req.session.admin) {
        User.findOne({ _id: req.session.data._id })
            .lean()
            .exec()
            .then((response) => {
                Plan.findOne({ _id: mongoose.Types.ObjectId(response.cart) })
                    .lean()
                    .exec()
                    .then((response) => res.send(response));
            });
    }
});

router.post('/uploadPlan', upload, (req, res) => {
    let priceStr = String(req.body.price);
    console.log(req.file.mimetype);
    let tempArray = [];
    JSON.parse(req.body.items).forEach((element) => {
        tempArray.push(element);
    });
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
        newPlan.save((err) => {
            if (err) {
                console.log('Error saving the plan');
            } else {
                console.log('Plan saved!');
            }
        });
    } else console.log('enter data pls');
    res.redirect('/dashboard');
    // res.send('cool');
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
        console.log('test');
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
                            if (response) {
                                req.session = {
                                    admin: user.admin,
                                    data: user,
                                    page: { dashboard: true },
                                    layout: 'mainLogged',
                                    email: formData.email,
                                    origin: 1,
                                    cart: user.cart.length > 0 ? 1 : 0,
                                    sesh: { sesh: true }
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
                    console.log('no user found');
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
        console.log(req.session);
        res.render('adminDashboard', {
            email: req.session.email,
            data: req.session.data,
            page: req.session.page,
            layout: req.session.layout,
            sesh: req.session.sesh,
            cart: req.session.cart
        });
    } else {
        res.render('dashboard', {
            email: req.session.email,
            data: req.session.data,
            page: req.session.page,
            layout: req.session.layout,
            sesh: req.session.sesh,
            cart: req.session.cart
        });
    }
});

router.post('/registration', (req, res) => {
    let formData = validation.regValidation(req.body);
    const sesh = req.session;

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
                admin: false
            });
            userInfo.save((err) => {
                if (err) {
                    console.log(err);
                    res.render('registration', {
                        data: formData,
                        dbError: { regError: true },
                        layout: 'form'
                    });
                } else {
                    req.session = {
                        data: formData,
                        cart: user.cart.length > 0 ? 1 : 0,
                        page: { dashboard: true },
                        layout: 'mainLogged',
                        origin: 2,
                        sesh: { sesh: true },
                        email: formData.emailadd
                    };
                    console.log('User saved!');
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
