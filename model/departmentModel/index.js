const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');
const { Console } = require('console');

function hashPass(pass) {
    var hash = crypto.createHash('sha256');
    return hash.update(pass).digest('hex');
}

const getDepartment = (req, res) => {
    db.query(`SELECT * FROM department`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}

module.exports = {
    getDepartment,
}