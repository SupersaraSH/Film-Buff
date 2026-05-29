const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

connection.getConnection((err, conn) => {
    if (err) {
        console.log(err.stack);
    } else {
        console.log("Conexion con bd ok");
        conn.release();
    }
});

module.exports = connection;