const mysql = require("mysql");
require("dotenv").config();

const myConnection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

module.exports = myConnection