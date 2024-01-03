var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');


router.get('/signup', user_controller.sign_up_get);
router.post('/signup', user_controller.sign_up_post);

module.exports = router;
