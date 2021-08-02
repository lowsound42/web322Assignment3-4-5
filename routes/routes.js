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

router.use(
    clientSessions({
        cookieName: 'session', // this is the object name that will be added to 'req'
        secret: 'hosterShmoster6524', // this should be a long un-guessable string.
        duration: 5 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
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
        sesh: sesh
    });
});

router.get('/planData', (req, res) => {
    Plan.find()
        .lean()
        .exec()
        .then((response) => {
            res.send(response);
        });
});

router.get('/plans', (req, res) => {
    let sesh = { sesh: false };
    if (req.session.email) {
        sesh.sesh = true;
    }
    Plan.find()
        .lean()
        .exec()
        .then((response) => {
            const page = { plan: true };
            res.render('plans', {
                data: response,
                page: page,
                sesh: sesh
            });
        });
});

router.post('/uploadPlan', upload, (req, res) => {
    var newPlan = new Plan({
        title: req.body.title,
        description: req.body.description,
        price: String(req.body.price),
        items: req.body.items,
        img: {
            data: fs.readFileSync(
                path.join('./static/photos/' + req.file.filename)
            ),
            contentType: 'image/png'
        }
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
});

router.get('/login', (req, res) => {
    if (req.session.email) {
        console.log('test');
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
        console.log(formData);
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
                                    sesh: { sesh: true }
                                };
                                console.log('__________________________');
                                console.log(user);
                                console.log('__________________________');
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
        console.log(req.session.layout);
        res.render('adminDashboard', {
            email: req.session.email,
            data: req.session.data,
            page: req.session.page,
            layout: req.session.layout,
            sesh: req.session.sesh
        });
    } else {
        res.render('dashboard', {
            email: req.session.email,
            data: req.session.data,
            page: req.session.page,
            layout: req.session.layout,
            sesh: req.session.sesh
        });
    }
});

router.post('/registration', (req, res) => {
    let formData = validation.regValidation(req.body);
    console.log(formData);
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
