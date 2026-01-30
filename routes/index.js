const express = require('express');
const indexControllers = require('../controllers/indexControllers');
const router = express.Router();

/* GET home page. */
router.get('/', indexControllers.showHome);

module.exports = router;
