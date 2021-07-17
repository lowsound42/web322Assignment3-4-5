let router = require('express').Router();
var validation = require('../services/validation');
let User = require('../models/User');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.get('/', (req, res) => {
    const page = { home: true };
    res.render('index', {
        page: page
    });
});

router.get('/plans', (req, res) => {
    const data = [
        {
            personal: true,
            title: 'Personal',
            description: 'Affordable plan, great for personal projects',
            price: 'C$3.89/mo',
            items: [
                'STARTER Performance',
                'Single Website',
                'Unlimited Space and Traffic',
                'Powered by renewable energy',
                'All-inclusive STARTER email',
                'Standard hosting features',
                'Free site migration'
            ]
        },
        {
            pro: true,
            title: 'Pro',
            description:
                'Pro performance, premium features, free domain, and more!',
            price: 'C$3.92/mo',
            items: [
                'PRO Performance',
                'Unlimited Websites',
                'Unlimited Space and Traffic',
                'Powered by renewable energy',
                'All-inclusive PRO email',
                'Standard hosting features',
                'Free site migration',
                'Free domain',
                'Optimized for WordPress',
                'Premium Features',
                'Email Marketing',
                'SSL certificate'
            ]
        },
        {
            enterprise: true,
            title: 'Enterprise',
            description:
                'Best performance for demanding websites, with SSL & dedicated IP',
            price: 'C$11.89/mo',
            items: [
                'ENTERPRISE Performance',
                'Unlimited Websites',
                'Unlimited Space and Traffic',
                'Powered by renewable energy',
                'All-inclusive ENTERPRISE email',
                'Standard hosting features',
                'Free site migration',
                'Free domain',
                'Optimized for WordPress',
                'Premium Features',
                'Email Marketing',
                'SSL certificate',
                'Dedicated IP'
            ]
        }
    ];
    const page = { plan: true };
    res.render('plans', {
        data: data,
        page: page
    });
});

router.get('/login', (req, res) => {
    const page = { login: true };
    res.render('login', {
        page: page,
        layout: 'form'
    });
});

router.get('/registration', (req, res) => {
    const page = { registration: true };
    res.render('registration', {
        page: page,
        layout: 'form'
    });
});

router.post('/login', (req, res) => {
    let formData = validation.logValidation(req.body);
    console.log(formData);

    if (
        formData.password.length > 0 &&
        formData.pError === false &&
        formData.emailError === false
    ) {
        console.log(formData);
        User.findOne({ email: formData.email })
            .exec()
            .then((user) => {
                if (user) {
                    bcrypt.compare(
                        formData.password,
                        user.password,
                        function (err, response) {
                            if (response) {
                                res.render('dashboard', {
                                    data: formData,
                                    page: { dashboard: true },
                                    layout: 'form'
                                });
                            } else {
                                res.render('login', {
                                    data: formData,
                                    page: { login: true },
                                    layout: 'form'
                                });
                            }
                        }
                    );
                } else {
                    console.log('no user found');
                }
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
                company: formData.company
            });
            userInfo.save((err) => {
                if (err) {
                    res.render('registration', {
                        data: formData,
                        layout: 'form'
                    });
                } else {
                    console.log('User saved!');
                    res.render('dashboard', {
                        data: formData
                    });
                }
            });
        });
    }
});

module.exports = router;
