const bcrypt = require('bcrypt');
const connection = require('../config/db.js');

class usersController{

  showUsers = (req, res) =>{
    res.render("users");
  };

  showRegister = (req, res) =>{
    res.render("formRegister");
  };

  register = (req,res)=> {
    console.log("Post Register data:", req.body);

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
          "Debes rellenar todos lo campos obligatorios.",
      });
    } else if (password != repPassword) {
      res.render("formRegister", {
        message: "Las password no coinciden.",
      });
    } else {
      //encriptar la password
      let saltRounds = 8;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          throw err;
        } else {
          console.log("hhhaaassshh", hashedPassword);
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
                res.render("formRegister", { message: "Email duplicado" });
              } else {
                throw errSql;
              }
            } else {
              res.render("/");
            }
          });
        }
      });
    }
  }

  showLogin = (req, res) =>{
    res.render("formLogin");
  };

};

module.exports = new usersController();