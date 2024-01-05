const express = require('express');
const router = express.Router();

const messages_controller = require('../controllers/messageController');

router.get('/new', messages_controller.new_message_get);
router.post('/new', messages_controller.new_message_post);

router.get('/list', function (req, res, next) {
    res.render('message_list.jade');
});

module.exports = router;