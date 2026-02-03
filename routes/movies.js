const express = require('express');
const moviesControllers = require('../controllers/moviesControllers');

const uploadImage = require('../middlewares/uploadImage');
const router = express.Router();

/* GET movies page. */
/* all movies */
router.get('/', moviesControllers.showMovies);

router.post('/moviesSelect', moviesControllers.selectMovies);

/* one movies */
router.get('/movie/:film_id', moviesControllers.showOneMovie);

/* show form to add movie */
router.get('/addMovie/:user_id', moviesControllers.showAddMovie);

/*  send form data to add movie */
router.post('/addMovie/:user_id', uploadImage("movies"), moviesControllers.addMovie);

/* show form to add movie */
router.get('/addMovieSelect', moviesControllers.showAddMovieSelect);

/*  send form data to add movie with select */
router.post('/addMovieSelect', uploadImage("movies"), moviesControllers.addMovieSelect);

/* show form to edit movie */
router.get('/editMovie/:film_id', moviesControllers.showEditMovie);

/*  send form data to edit movie */
router.post('/editMovie/:film_id/:user_id', uploadImage("movies"), moviesControllers.editMovie);

//borra una película.
router.get('/delMovie/:film_id/:user_id/:file', moviesControllers.delMovie);

//borrado lógico una película.
router.get('/delLogicMovie/:film_id/:user_id', moviesControllers.delLogicMovie);

router.get('/')

module.exports = router;
