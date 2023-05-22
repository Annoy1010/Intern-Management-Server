const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');
const { Console } = require('console');

function hashPass(pass) {
    var hash = crypto.createHash('sha256');
    return hash.update(pass).digest('hex');
}

const getTeacher = (req, res) => {
    const {department_id} = req.query;
    console.log(department_id);
    db.query(`SELECT t.id, p.full_name FROM teacher t, user_person p WHERE t.user_id = p.id and t.department_id = '${department_id}'`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}

module.exports = {
    getTeacher,
}