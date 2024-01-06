require('dotenv').config()
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("passport");



//signup page
exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render('sign_up_form', { title: 'Sign up' });
})

exports.sign_up_post = [
    body('first_name', 'First name must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('last_name', 'Last name must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('username', 'Username must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .custom(async (value) => {
            console.log(value);
            const username = await User.find({ username: value }).exec();
            if (username.length) {
                throw new Error('This username is already in use')
            }
        }),
    body('password', 'Password must contain at least 5 characters')
        .trim()
        .isLength({ min: 5 }),
    body('password_confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            } else {
                return true;
            };
        }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
            membership: req.body.membership
        });

        if (!errors.isEmpty()) {
            res.render('sign_up_form', {
                title: 'Sign up',
                user,
                errors: errors.array(),
            });
            return;
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                try {
                    user.password = hashedPassword;
                    await user.save();
                    res.redirect("/users/login");
                } catch (err) {
                    return next(err);
                };
            });
        }
    })
];

//login page
exports.log_in_get = asyncHandler((req, res, next) => {
    res.render('log_in_form', { title: 'Log in' });
});

exports.log_in_post = passport.authenticate("local", {
    successRedirect: "/message/list",
    failureRedirect: "/users/login",
    failureMessage: true
});

exports.log_out_get = asyncHandler((req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
})

// Upgrade page
exports.upgrade_form_get = asyncHandler((req, res, next) => {
    res.render('upgrade_form', { title: 'Upgrade your account' })
})

exports.upgrade_form_post = [
    body('upgrade_password')
        .trim()
        .custom((value) => {
            if (value !== "hello") {
                throw new Error('Wrong');
            } else {
                return true;
            }
        }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('upgrade_form', {
                title: 'Upgrade your account',
                errors: errors.array(),
            });
            return;
        } else {
            const user = req.user;
            await User.findOneAndUpdate({ _id: user._id }, { membership: true });
            res.redirect('/message/list'); 
        }
    })
];


