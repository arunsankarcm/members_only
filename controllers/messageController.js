const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Message = require('../models/message');

// New message page
exports.new_message_get = asyncHandler(async (req, res, next) => {
    res.render('new_message_form', {
        title: 'New message'
    })
})

exports.new_message_post = [
    body('message_title', 'Invalid title')
        .trim()
        .isLength({ min: 2, max: 100 })
        .escape()
        .unescape("&#39;", "'"),
    body('message_text', 'Invalid message')
        .trim()
        .isLength({ min: 2, max: 200 })
        .escape()
        .unescape("&#39;", "'"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const message = new Message({
            title: req.body.message_title,
            text: req.body.message_text,
            author: req.user,
            timestamp: Date.now(),
        });

        if (!errors.isEmpty()) {
            res.render(('new_message_form', {
                title: 'New message',
                message,
                errors: errors.array(),
            }));
            return;
        } else {
            await message.save();
            res.redirect('/message/list');
        }
    })
]

// Homepage, messages list
exports.message_list_get = asyncHandler(async (req, res, next) => {
    try {
        const messages = await Message.find({})
            .sort({ timestamp: -1 })
            .populate('author')
            .exec();

        res.render('message_list', { messages });
    } catch (err) {
        res.status(500).send('Error fetching messages');
    }
});


exports.message_delete_post = asyncHandler(async (req, res, next) => {
    try {
        const message = await Message.findById(req.body.messageid).exec();
        if (message === null) {
            res.redirect('/message/list');
        } else {
            await Message.findOneAndDelete({ _id: req.body.messageid });
            res.redirect('/message/list');
        }
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send('Error deleting message');
    }
});
