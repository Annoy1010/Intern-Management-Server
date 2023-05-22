const mysql = require("mysql");
require("dotenv").config();

const myConnection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit : 100,
    waitForConnections : true,
    queueLimit :0,
    debug:  true,
    wait_timeout : 28800,
    connect_timeout :10
})

module.exports = myConnection