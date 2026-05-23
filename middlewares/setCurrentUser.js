const jwt = require('jsonwebtoken');

const setCurrentUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      res.locals.currentUser = jwt.verify(token, process.env.TOKEN_KEY);
    } catch {
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }
  next();
};

module.exports = setCurrentUser;
