var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');


router.get('/signup', user_controller.sign_up_get);
router.post('/signup', user_controller.sign_up_post);

router.get('/login', user_controller.log_in_get);
router.post('/login', user_controller.log_in_post);

router.get('/logout', user_controller.log_out_get);

router.get('/upgrade', user_controller.upgrade_form_get);
router.post('/upgrade', user_controller.upgrade_form_post)

module.exports = router;
