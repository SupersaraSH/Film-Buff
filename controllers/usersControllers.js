const bcrypt = require('bcrypt');
const connection = require('../config/db.js');
const drawRating = require('../utils/drawRating.js');
const deleteFile = require('../utils/delImage');
const jwt = require('jsonwebtoken');

class usersController{

  showLogin = (req, res) => {
    res.render("formLogin", {errores:[]});
  }

  logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  }

  login = (req, res) =>{
    console.log("loginnnn: req.body", req.body);
    const { email, password } = req.body;
    //comprobar si el user existe en la bd 123gG!
    let sql = "select * from user where email = ?";
    connection.query(sql, [email], (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        //si la base de datos no devuelve ningún resultyado es que no ha 
        // encontrado el mail introducido por el usuario
        if (!result.length) {
          res.status(401).render("formLogin", {
            errores: [{ field: "email", message: "Email o contraseña incorrectos" }]
          })
          } else {
            // comprobar password
            bcrypt.compare(password, result[0].password, (errCompare, match)=> {
              if (errCompare){
                res.status(500).json({message: "Error trying to check the password"})
              } else {
                //contraseñas comprobadas
                if (match == false) {
                  res.status(401).render("formLogin", {
                    errores: [{ field: "password", message: "Email o contraseña incorrectos" }]
                  });
                  } else {
                    
                    let [user] = result;
                    console.log("userrrrr: ", user);
                  //genero un token para mandarlo al front
                  //método sign de 
                  //jwt.sign(
                  //payload (datos),
                  //secretOrPrivateKey (firma),
                  //options(configuraciones));
                  const token = jwt.sign(
                    {
                      user_id: user.user_id,
                      user_name: user.user_name
                    },
                    process.env.TOKEN_KEY,
                    {
                      expiresIn:"90min"
                      //1s = 1 segundo
                      //1m = 1 minutos
                      //1h = 1 horas
                      //1d = 1 dias
                    }
                  );
                  res.cookie("token", token, {
                    //Seguridad: con  le dices al navegador que la cookie NO puede ser leída ni modificada por JavaScript.
                    //protege el token de ataques tipo XSS (Cross-Site Scripting).
                    //funciona igual sin esto, pero seria menos seguro.
                    httpOnly: true
                  });
                  res.redirect(`/users/userProfileToken/${user.user_id}`);
                  /* res.status(200).json({
                    message: "Correct credentials!!! YOU ARE IN!!!",
                    token:token
                  }); */
              }
            }
          })
        }
      }
    });

    
    /* res.redirect(`/users/userProfile/${user.user_id}`); */


  };

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

  showProfileToken = (req, res) =>{
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

        res.render('userProfileToken', { user, films });
      };

    });
  };

  showRegisterZod = (req, res) =>{
    res.render("formRegister", {errores:[]});
  };

  registerZod = (req, res) => {
    const {
      user_name,
      last_name,
      email,
      description,
      password,
      repPassword,
    } = req.body
    
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
            req.file.path,
          ];
        }
        connection.query(sql, values, (err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect(`/#addicts`);
          }
        });
      }
    });
  }

  showEditUserZod = (req, res) =>{
    const {user_id} = req.params;

    let sql = 'SELECT * FROM user WHERE user_id = ?'
    connection.query(sql, [user_id], (err, result)=>{
      if(err){
        throw err
      }else{
        res. render("formEditUser", {user:result[0], errores:[]})
      }
    });
  };
  
  editUserZod = (req, res) => {
    const {user_name, last_name, description} = req.body;
    const {user_id} = req.params;
    let user = {user_name, last_name, description};

    let sql = 'UPDATE user SET user_name = ?, last_name = ?, description = ? WHERE user_id=?';
    let values = [user_name, last_name, description, user_id];

    if(req.file){
      sql = 'UPDATE user SET user_name = ?, last_name = ?, description = ?, avatar = ? WHERE user_id=?';
      values = [user_name, last_name, description, req.file.path, user_id];
    };

    connection.query(sql, values, (err, result)=>{
      if(err){
          throw err;
      }else{
        console.log("**************************ccvx*********************************")
        res.redirect(`/users/userProfileToken/${user_id}`);
      };
    });
  };

  //UNUSED to switch to the zod as a validation system
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
              req.file.path,
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
        values = [user_name, last_name, description, req.file.path, user_id];
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