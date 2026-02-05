const { ZodError } = require("zod");
const deleteFile = require("../utils/delImage");
const connection = require('../config/db.js');

//aqui verificamos los campos del formulario que vienen en el req.body
//y lo verificamos gracias a un eschema de verificación

const addMovieSelectVerifyForm = (schema) => (req, res, next) => {
  // guardo los datos del req.body y si vienen, del file. 
  // poniendo los ... se hace una copia del array  
  const data = {
    ...req.body,
    ...(req.file ? {file:req.file }: null)
  };

  try {
    //parse = “verificar y transformar datos para que tengan sentido”
    schema.parse(data);

    //Valida los datos con schema.parse(data)
    // Si todo está bien, llama a next()
    // next() le dice a Express:
    // “ok, sigue con el siguiente middleware o controlador”
    next();

  } catch (error) {
    if (req.file) {
      if (req.file.filename != "film.png") {
        deleteFile(req.file.filename, "movies");
      };
    };

    let sql = 'SELECT user_id, user_name, last_name FROM user WHERE user_is_deleted = 0';
    connection.query(sql, (err, result)=>{
      if(err){
        throw err
      }else{
        res.render('formNewMovieSelect', {
          users:result, 
          errores: error.issues.map((e)=> {
            return {
              field: e.path[0],
              message: e.message
            };
          })
        });
      };
    });
    
  };

}

module.exports = addMovieSelectVerifyForm;