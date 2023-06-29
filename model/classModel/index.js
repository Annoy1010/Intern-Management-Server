const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');
const { Console } = require('console');

function hashPass(pass) {
    var hash = crypto.createHash('sha256');
    return hash.update(pass).digest('hex');
}

const addClassModel = (req, res) => {
    console.log(req.body);
    const {name, students, academic_year, head_teacher, department_id} = req.body;
    db.query(`SELECT class_name FROM class WHERE class_name = '${name}'`, (err, result) => {
        if (err){
            console.log(err);
        }else{
            if(result.length !== 0){
                res.send({
                    statusCode: 401,
                    responseData: 'Tên lớp đã được sử dụng vui lọng chọn tên khác!',
                });
            }else{
                db.query(`INSERT INTO class (class_name, students, academic_year, head_teacher, department_id) VALUES ('${name}', ${students}, ${academic_year}, '${head_teacher}', '${department_id}')`,(err, result) => {
                    if(err){
                        console.log(err);
                    }else{
                        res.send({
                            statusCode: 200,
                            responseData: 'Thêm lớp thành công',
                        });
                    }
                })
            }
        }
    })
}

const getClassAllModel = (req, res, search) => {
    db.query(`SELECT c.id, c.class_name, d.department_name, department_id, c.head_teacher, c.students FROM class c, department d WHERE c.department_id = d.id and c.class_name LIKE '%${search}%'`, (err, result) => {
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
}

const getClassYearModel = (req, res) => {
    const year = req.query.year;
    console.log(year);
    db.query(`SELECT c.id, c.class_name, d.department_name, department_id, c.head_teacher, c.students FROM class c, department d WHERE c.academic_year = ${year} and c.department_id = d.id`, (err, result) => {
        if (err){
            console.log(err);
        }else {
            res.send(result);
            console.log(result);
        }
    });
}

const getAcademicYear = (req, res) => {
    db.query('SELECT DISTINCT academic_year FROM class', (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
            console.log(result);
        }
    })
}

const updateClass = (req, res) => {
    const {name, students, academic_year, head_teacher, department_id} = req.body.newclass;
    const id = req.body.classId;
    db.query(`SELECT class_name FROM class WHERE class_name = '${name}' and id != '${id}'`, (err, result) => { 
        if (err){
            console.log(err);
        }else{
            if(result.length !== 0){
                res.send({
                    statusCode: 401,
                    responseData: 'Tên lớp đã được sử dụng vui lọng chọn tên khác!',
                });
            }else{
                db.query(`UPDATE class SET class_name = '${name}', department_id = ${department_id}, head_teacher = ${head_teacher}, students = ${students} WHERE id = ${id};`,(err, result) => {
                    if(err){
                        console.log(err);
                    }else{
                        res.send({
                            statusCode: 200,
                            responseData: 'Cập nhật thành công',
                        });
                    }
                })
            }
        }
    })
}

const deleteClassModel = (req, res) => {
    const class_id = req.query.class_id;
    db.query(`DELETE FROM class WHERE id = ${class_id}`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send({
                statusCode: 200,
                responseData: 'Xóa lớp thành công',
            });
        }
    });
}

const getClassOfDepartment = (req, res) => {
    const {department_id} = req.query;
    db.query(`SELECT * FROM class WHERE department_id = ${department_id}`, (err, result) => {
        if(err) {
            console.log(err);
        }else{
            res.send(result);
        }
    });
}

module.exports = {
    addClassModel,
    getClassAllModel,
    getClassYearModel,
    getAcademicYear,
    updateClass,
    deleteClassModel,
    getClassOfDepartment,
}