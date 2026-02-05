const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/usersControllers');
const uploadImage = require('../middlewares/uploadImage');
const verifyForm = require('../middlewares/verifyForm.js');

const editUserVerifyForm = require('../middlewares/editUserverifyForm.js');
const registerVerifyForm = require('../middlewares/registerVerifyForm.js');
const registerSchema = require('../schemas/registerSchema.js');
const editUserSchema = require('../schemas/editUserSchema.js');

/* GET users page. */
/* users */
router.get('/', usersControllers.showUsers);

/* show new register form */
router.get('/register', usersControllers.showRegisterZod);

/* send data register form */
router.post('/register', uploadImage("users"), registerVerifyForm(registerSchema), usersControllers.registerZod);

/* show new login form */
/* SIN TERMINAR */
router.get('/login', usersControllers.showLogin);

/* show new login form */
router.get('/userProfile/:user_id', usersControllers.showProfile);

router.get('/editUser/:user_id', usersControllers.showEditUserZod);

router.post('/editUser/:user_id', uploadImage("users"), editUserVerifyForm(editUserSchema), usersControllers.editUserZod);

module.exports = router;
