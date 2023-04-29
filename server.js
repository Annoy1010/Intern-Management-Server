const express = require("express");
const db = require("./model");
const app = express();

const PORT = 8080;

db.connect((err) => {
    if (err) {
        console.log("Fail to connect to server");
    } else {
        console.log("Connect database successfully")
    }
})

app.get('/api/school', (req, res) => {
    db.query("SELECT * FROM school", (err, result) => {
        if (err) {
            console.log("Cannot get data from school data")
        } else {
            res.send(result);
        }
    })
})

app.listen(PORT, () => {
    console.log('Server is running on 8080');
})