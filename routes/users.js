const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const uploadImage = require('../middlewares/uploadImage');
const router = express.Router();

/* GET users page. */
/* users */
router.get('/', usersControllers.showUsers);

/* show new register form */
router.get('/register', usersControllers.showRegister);

/* show new register form */
router.post('/register', uploadImage("users"), usersControllers.register);

/* show new login form */
router.get('/login', usersControllers.showLogin);

module.exports = router;
