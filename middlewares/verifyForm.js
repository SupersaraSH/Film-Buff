const { ZodError } = require("zod");
const deleteFile = require("../utils/delImage");

//aqui verificamos los campos del formulario que vienen en el req.body
//y lo verificamos gracias a un eschema de verificación

const verifyForm = (schema, defaultImg, folder, renderForm) => (req, res, next) => {
  console.log("verifyyyFormmmmm ", req.body);

  // guardo los datos del req.body y si vienen, del file. 
  // poniendo los ... se hace una copia del array
  
  const data = {
    ...req.body,
    ...(req.file ? {file:req.file }: null)
  };

  console.log("dataaaaaaaaaaaaaa ", data);

  try {
    console.log("estoy en el try")
    //parse = “verificar y transformar datos para que tengan sentido”
    schema.parse(data);
    console.log("ha pasado el parse")

    //Valida los datos con schema.parse(data)
    // Si todo está bien, llama a next()
    // next() le dice a Express:
    // “ok, sigue con el siguiente middleware o controlador”
    next();
    console.log("ha pasado el next")

  } catch (error) {
    if (req.file) {
      if (req.file.filename != defaultImg) {
        deleteFile(req.file.filename, folder);
      };
    };

  res.render(renderForm, {user: req.body, errores: error.issues.map((e)=> {
    return {
      field: e.path[0],
      message: e.message
    };
    })});
    
  };
}


module.exports = verifyForm;