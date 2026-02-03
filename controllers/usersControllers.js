const bcrypt = require('bcrypt');
const connection = require('../config/db.js');
const drawRating = require('../utils/drawRating.js');
const deleteFile = require('../utils/delImage');

class usersController{

  showUsers = (req, res) =>{
    res.render("users");
  };

  showProfile = (req, res) =>{
    const {user_id} = req.params
    let sql = `SELECT u.user_id, u.user_name, u.last_name, u.email, 
              u.description, u.password, u.avatar, f.film_id, f.title,
              f.review, f.rating, f.format, f.release_year, f.poster, 
              f.user_id as f_user_id 
              FROM user AS u LEFT JOIN film AS f 
              ON u.user_id = f.user_id AND f.film_is_deleted = 0
              WHERE u.user_is_deleted = 0 AND u.user_id = ? `

    connection.query(sql, [user_id], (err, result)=>{
      if(err){
        throw err;
      }else{
        //reduce de la data del user
        const {user_id, user_name, last_name, email, description, password, avatar} = result[0]
        let user = {
          user_id,
          user_name,
          last_name,
          email, 
          description,
          password,
          avatar
          
        }

        //reduce de las peliculas
        let films = [];
        let temporalFilm = {};
        
        result.forEach((elem)=>{
          if(elem.film_id){
            //pintar rating
            let starsRating = drawRating(elem.rating);
            temporalFilm={
              film_id: elem.film_id,
              title: elem.title,
              review: elem.review,
              rating: starsRating,
              format: elem.format,
              release_year: elem.release_year,
              poster: elem.poster,
              user_id: user_id
            };
            films.push(temporalFilm);
          };
        });

        res.render('userProfile', {user, films});
      };

    });
  };

  showRegister = (req, res) =>{
    res.render("formRegister");
  };

  register = (req,res)=> {
    const {
      user_name,
      last_name,
      email,
      description,
      password,
      repPassword,
    } = req.body

    //validación: verificación simple de que los campos obigatorios no lleguen vacios
    //y los pasword sean iguales
    if (!user_name || !email || !password) {
      res.render("formRegister", {
        message:
          "You must fill in all required fields.",
      });
    } else if (password != repPassword) {
      res.render("formRegister", {
        message: "The passwords do not match.",
      });
    } else {
      //encriptar la password
      let saltRounds = 8;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          throw err;
        } else {
          //guardar los datos en la base de datos
          let sql = `INSERT INTO user 
        (user_name, last_name, email, description, password) 
        VALUES (?,?,?,?,?)`;
          let values = [
            user_name,
            last_name,
            email,
            description,
            hashedPassword,
          ];

          if (req.file) {
            sql = `INSERT INTO user 
          (user_name, last_name, email, description, password, avatar) 
          VALUES (?,?,?,?,?,?)`;
            values = [
              user_name,
              last_name,
              email,
              description,
              hashedPassword,
              req.file.filename,
            ];
          }
          connection.query(sql, values, (errSql, result) => {
            if (errSql) {
              if (errSql.errno == 1062) {
                res.render("formRegister", { message: "Duplicate email." });
              } else {
                throw errSql;
              }
            } else {
              res.redirect(`/userProfile/${user_id}`);
            }
          });
        }
      });
    }
  }

  showLogin = (req, res) =>{
    res.render("formLogin");
  };

  showEditUser = (req, res) =>{
    const {user_id} = req.params;

    let sql = 'SELECT * FROM user WHERE user_id = ?'
    connection.query(sql, [user_id], (err, result)=>{
      if(err){
        throw err
      }else{
        res. render("formEditUser", {user:result[0]})
      }
    });
  };

  editUser = (req, res) => {
    const {user_name, last_name, description} = req.body;
    const {user_id} = req.params;
    let user = {user_name, last_name, description};

    if (!user_name || !last_name) {
      res.render("formEditUser", {user,
      message:
        "You cannot leave the name or surname field blank.",
    });

    } else {
      let sql = 'UPDATE user SET user_name = ?, last_name = ?, description = ? WHERE user_id=?';
      let values = [user_name, last_name, description, user_id];

      if(req.file){
        //si se cambia la foto, borrar la antigua de la carpeta
        let sqlAvatar = `SELECT avatar FROM user WHERE user_id= ${user_id}`
        connection.query(sqlAvatar, (err, result)=>{
          if(err){
            throw err
          }else{
            const {avatar} = result[0];
            console.log(avatar);
            deleteFile(avatar,"users");
          };
        });

        sql = 'UPDATE user SET user_name = ?, last_name = ?, description = ?, avatar = ? WHERE user_id=?';
        values = [user_name, last_name, description, req.file.filename, user_id];
      };

      connection.query(sql, values, (err, result)=>{
        if(err){
            throw err;
        }else{
          res.redirect(`/users/userProfile/${user_id}`);
        };
      });
    };
  };

};

module.exports = new usersController();