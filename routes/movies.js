const express = require('express');
const moviesControllers = require('../controllers/moviesControllers');
const router = express.Router();

/* GET movies page. */
/* all movies */
router.get('/', moviesControllers.showMovies);

/* show form to add movie */
router.get('/addMovie', moviesControllers.showAddMovie);

/* show form to edit movie */
router.get('/editMovie', moviesControllers.showEditMovie);

module.exports = router;
