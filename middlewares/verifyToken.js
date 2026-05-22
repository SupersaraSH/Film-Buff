const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  //Las cookies son como un “carnet de identidad” que el navegador enseña 
  // automáticamente en cada request
  console.log("verifyToken    ",token)

  if (!token) {
    return res.status(401).render("formLogin", {
      errores: [{ message: "You must be logged in" }]
    });
  }

  try {
    //jwt.verify(...)→ comprueba que el token es válido
    //Devuelve el payload del token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded; // guardamos datos del user (el payload)
    next();
  } catch (error) {
    return res.status(401).render("formLogin", {
      errores: [{ message: "Invalid or expired token" }]
    });
  }
};

module.exports = verifyToken;