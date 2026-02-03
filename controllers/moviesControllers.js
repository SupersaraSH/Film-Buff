const connection = require('../config/db.js');
const deleteFile = require('../utils/delImage');
const drawRating = require('../utils/drawRating.js');

class MoviesController{

  showMovies = (req, res) =>{
    const {filter} = req.query;

    let sql= "SELECT film_id, user_id, poster FROM film WHERE film_is_deleted = 0";

    if (filter == "title"){
      sql = "SELECT film_id, user_id, poster FROM film WHERE film_is_deleted = 0 order by title asc, title ASC;";

    } else if (filter == "rating") {
      sql = "SELECT film_id, user_id, poster FROM film WHERE film_is_deleted = 0 order by rating, title ASC;";

    }else if (filter == "release_year") {
      sql = "SELECT film_id, user_id, poster FROM film WHERE film_is_deleted = 0 order by release_year, title ASC;";

    }
    connection.query(sql, (err, result)=> {
      if(err){
        throw err
      }else{
        res.render('movies', {films:result, filter});
      };
    });
  };

  selectMovies = (req, res) => {
    const {order_by} = req.body;

    let sql = `SELECT film_id, title, poster 
              FROM film 
              WHERE film_is_deleted = 0 
              order by ${order_by} asc`;

    connection.query(sql, (err, result)=> {
      if(err){
        throw err
      }else{
        res.render('moviesSelect', {films:result});
      };
    });

  };

  showOneMovie = (req, res) =>{
    const {film_id} = req.params;
    let sql = "SELECT * FROM film WHERE film_id = ?";
    connection.query(sql, [film_id], (err, result)=> {
      if(err){
        throw err
      }else{
        result[0].rating = drawRating(result[0].rating);
        res.render('oneMovie', {film:result[0]});
      };
    });
  };

  showAddMovie = (req, res)=> {
    const {user_id} = req.params;
    res.render("formNewMovie", {user_id});
  };

  addMovie = (req, res) => {
    const { user_id } = req.params;

    const {
      title,
      review,
      rating,
      format,
      release_year,
    } = req.body

    //validación: verificación simple de que los campos obigatorios no 
    // lleguen vacios

    let pattern_year = /^\d*$/;
    let pattern_rating = /^[1-5]$/;

    if (!title || !rating) {
    res.render("formNewMovie", {
      message:
        "You must fill in all required fields.",
    });

    } else if (pattern_year.test(release_year) == false) {
      res.render("formNewMovie", {
        message: "The year field must be a number.",
      });

    } else if (pattern_rating.test(rating) == false) {
      res.render("formNewMovie", {
        message: "The rating must be between 1 and 5.",
      });

    } else {
      //guardar los datos en la base de datos
      let sql = `INSERT INTO film 
      (user_id, title, review, rating, format, release_year)
      VALUES (?,?,?,?,?,?)`;

      let values = [
        user_id,
        title,
        review,
        rating,
        format,
        release_year,
      ];

      if (req.file) {
        sql = `INSERT INTO film 
        (user_id, title, review, rating, format, release_year, poster) 
        VALUES (?,?,?,?,?,?,?)`;
        values = [
          user_id,
          title,
          review,
          rating,
          format,
          release_year,
          req.file.filename,
        ];
      }
      connection.query(sql, values, (errSql, result) => {
        if (errSql) {
          if (errSql.errno == 1062) {
            res.render("formNewMovie", { message: "Duplicate email." });
          } else {
            throw errSql;
          }
        } else {
          res.redirect(`/users/userProfile/${user_id}`);
        }
      });
    }
  }

  //NO SIRVE
  showAddMovieSelect = (req, res)=> {
    let sql = 'SELECT user_id, user_name, last_name FROM user WHERE user_is_deleted = 0';
      connection.query(sql, (err, result)=>{
        if(err){
          throw err
        }else{
          res.render('formNewMovieSelect', {users:result});
        };
      });
  };

  //NO SIRVE
  addMovieSelect = (req, res) => {
    const {
      user_id,
      title,
      review,
      rating,
      format,
      release_year,
    } = req.body

    let sql = 'SELECT user_id, user_name, last_name FROM user WHERE user_is_deleted = 0';

    //validación: verificación simple de que los campos obigatorios no 
    // lleguen vacios
    let pattern_year = /^\d*$/;
    let pattern_rating = /^[1-5]$/;

    if (!title || !rating) {
      /* llamada bd */
      connection.query(sql, (err1, result1)=>{
        if(err1){
          throw err1
        }else{
          res.render('formNewMovieSelect', {
            users:result1, 
            message: "You must fill in all required fields."
          });
        };
      });

    } else if (pattern_year.test(release_year) == false) {
      connection.query(sql, (err2, result2)=>{
        if(err2){
          throw err2
        }else{
          res.render('formNewMovieSelect', {
            users:result2, 
            message: "The year field must be a number."
          });
        };
      });

    } else if (pattern_rating.test(rating) == false) {
      connection.query(sql, (err3, result3)=>{
        if(err3){
          throw err3
        }else{
          res.render('formNewMovieSelect', {
            users:result3, 
            message: "The rating must be between 1 and 5."
          });
        };
      });

    } else {
      let values = [
        user_id,
        title,
        review,
        rating,
        format,
        release_year,
      ];

      if (req.file) {
        sql = `INSERT INTO film 
        (user_id, title, review, rating, format, release_year, poster) 
        VALUES (?,?,?,?,?,?,?)`;
        values = [
          user_id,
          title,
          review,
          rating,
          format,
          release_year,
          req.file.filename,
        ];
      };

      connection.query(sql, values, (errSql, result) => {
        if (errSql) {
          if (errSql.errno == 1062) {
            res.render("formNewMovieSelect", { message: "Duplicate email." });
          } else {
            throw errSql;
          };
        } else {
          res.redirect(`/users/userProfile/${user_id}`);
        };
      });
    };
  };

  showEditMovie = (req, res) =>{
    const {film_id} = req.params;

    let sql = 'SELECT film_id, user_id, title, review, rating, format, release_year from film WHERE film_id = ?'
    connection.query(sql, [film_id], (err, result)=>{
      if(err){
        throw err
      }else{
        res. render("formEditMovie", {film:result[0]})
      }
    });
  };

  editMovie = (req, res) => {
    const {title, review, rating, format, release_year} = req.body;
    const {film_id, user_id} = req.params;
    let film = {film_id, user_id,title, review, rating, format, release_year};

    //validación: verificación simple de que los campos obigatorios no 
    // lleguen vacios
    let pattern_year = /^\d*$/;
    let pattern_rating = /^[1-5]$/;

    if (!title || !rating) {
      res.render("formEditMovie", {film,
      message:
        "You must fill in all required fields.",
    });

    } else if (pattern_year.test(release_year) == false) {
        res.render("formEditMovie", {film,
        message: "The year field must be a number.",
      });

    } else if (pattern_rating.test(rating) == false) {
        res.render("formEditMovie", {film,
        message: "The rating must be between 1 and 5.",
      });

    } else {
      let sql = 'UPDATE film SET title = ?, review = ?, rating = ?, format = ?, release_year = ? WHERE film_id=?';
      let values = [title, review, rating, format, release_year, film_id];
      
      if(req.file){
        //si se cambia la foto, borrar la antigua de la carpeta
        let sqlPoster = `SELECT poster FROM film WHERE film_id= ${film_id}`
        connection.query(sqlPoster, (err, result)=>{
          if(err){
            throw err
          }else{
            const {poster} = result[0];
            console.log(poster);
            deleteFile(poster,"movies");
          };
        });

        sql = 'UPDATE film SET title = ?, review = ?, rating = ?, format = ?, release_year = ? , poster=? WHERE film_id=?';
        values = [title, review, rating, format, release_year, req.file.filename, film_id]
      };
      connection.query(sql, values, (err, result)=>{
        if(err){
            throw err;
        }else{
          res.redirect(`/users/userProfile/${user_id}`);
        };
      });
    }
  };

  delMovie = (req, res) =>{
    const {film_id, user_id, file} = req.params;
    
    let sql = 'DELETE FROM film WHERE film_id=?'
    connection.query(sql, [film_id], (err, result)=>{
        if(err){
            throw err;
        }else{
          if (file != "film.png") {
            deleteFile(file,"movies");
          }
            res.redirect(`/users/userProfile/${user_id}`);
        }
    })
  }

  delLogicMovie = (req, res)=>{
    const {user_id, film_id} = req.params;

    let sql = 'UPDATE film SET film_is_deleted=1 WHERE film_id=?'

    connection.query(sql, [film_id], (err, result)=>{
      if(err){
        throw err
      }else{
        res.redirect(`/users/userProfile/${user_id}`);
      }
    })
  }

};

module.exports = new MoviesController();