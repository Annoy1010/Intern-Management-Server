const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');
const { Console } = require('console');

const getMajorOfDepartment = (req, res) => {
    const {department_id} = req.query;
    db.query(`SELECT * FROM major WHERE department_id = ${department_id}`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
}


module.exports = {
    getMajorOfDepartment,
}