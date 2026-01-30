const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'film_buff'
})

connection.connect((err)=>{
    if(err){
        console.log(err.stack);
    }else{
        console.log("Conexion con bd ok");
    }
});

module.exports = connection;