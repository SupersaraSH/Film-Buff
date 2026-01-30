const connection = require('../config/db.js');

class IndexController{

  showHome = (req, res) =>{
    let sql = `SELECT user_id, user_name, last_name, email, description, 
    password, avatar FROM user WHERE user_is_deleted = 0;`
    connection.query(sql, (err, result) =>{
      if(err){
        throw err;
      } else {
        console.log("result showHOMEEEEEE", result);
        res.render("index", {users: result})
      }
    });
  }

}

module.exports = new IndexController();