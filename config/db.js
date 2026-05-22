const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
    port: process.env.MYSQLPORT || 3306,
})

connection.connect((err)=>{
    if(err){
        console.log(err.stack);
    }else{
        console.log("Conexion con bd ok");
    }
});

module.exports = connection;