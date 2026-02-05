const { ZodError } = require("zod");
const deleteFile = require("../utils/delImage");

//aqui verificamos los campos del formulario que vienen en el req.body
//y lo verificamos gracias a un eschema de verificación

const addMovieVerifyForm = (schema) => (req, res, next) => {
  // guardo los datos del req.body y si vienen, del file. 
  // poniendo los ... se hace una copia del array  
  const data = {
    ...req.body,
    ...(req.file ? {file:req.file }: null)
  };

  const dataSend = {
    user_id: req.params.user_id, 
    ...data
  }

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

    res.render("formNewMovie", {user: dataSend, errores: error.issues.map((e)=> {
      return {
        field: e.path[0],
        message: e.message
      };
    })});
    
  };

}

module.exports = addMovieVerifyForm;