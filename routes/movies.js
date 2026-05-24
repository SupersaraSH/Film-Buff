const express = require('express');
const moviesControllers = require('../controllers/moviesControllers');

const uploadImage = require('../middlewares/uploadImage');
const addMovieVerifyForm = require('../middlewares/addMovieVerifyForm');
const addMovieSchema = require('../schemas/addMovieSchema');
const addMovieSelectVerifyForm = require('../middlewares/addMovieSelectVerifyForm');
const addMovieSelectSchema = require('../schemas/addMovieSelectSchema');
const editMovieVerifyForm = require('../middlewares/editMovieVerifyForm');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

/* GET movies page. */
/* all movies */
router.get('/', moviesControllers.showMovies);

/* one movies */
router.get('/movie/:film_id', moviesControllers.showOneMovie);

/* show form to add movie */
router.get('/addMovie/:user_id', verifyToken, moviesControllers.showAddMovieZod);

/*  send form data to add movie */
router.post('/addMovie/:user_id', verifyToken, uploadImage("movies"), addMovieVerifyForm(addMovieSchema), moviesControllers.addMovieZod);

/* show form to add movie */
router.get('/addMovieSelect', verifyToken, moviesControllers.showAddMovieSelectZod);

/*  send form data to add movie with select */
router.post('/addMovieSelect', verifyToken, uploadImage("movies"), addMovieSelectVerifyForm(addMovieSelectSchema), moviesControllers.addMovieSelectZod);

/* show form to edit movie */
router.get('/editMovie/:film_id', verifyToken, moviesControllers.showEditMovieZod);

/*  send form data to edit movie */
router.post('/editMovie/:film_id/:user_id', verifyToken, uploadImage("movies"), editMovieVerifyForm(addMovieSchema), moviesControllers.editMovieZod);

//borra una película.
router.get('/delMovie/:film_id/:user_id/:file', verifyToken, moviesControllers.delMovie);

//borrado lógico una película.
router.get('/delLogicMovie/:film_id/:user_id', verifyToken, moviesControllers.delLogicMovie);

router.get('/')

module.exports = router;
