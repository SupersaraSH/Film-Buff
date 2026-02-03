const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const uploadImage = require('../middlewares/uploadImage');
const router = express.Router();

/* GET users page. */
/* users */
router.get('/', usersControllers.showUsers);

/* show new register form */
router.get('/register', usersControllers.showRegister);

/* send data register form */
router.post('/register', uploadImage("users"), usersControllers.register);

/* show new login form */
/* SIN TERMINAR */
router.get('/login', usersControllers.showLogin);

/* show new login form */
router.get('/userProfile/:user_id', usersControllers.showProfile);

router.get('/editUser/:user_id', usersControllers.showEditUser);

router.post('/editUser/:user_id', uploadImage("users"), usersControllers.editUser);

module.exports = router;
