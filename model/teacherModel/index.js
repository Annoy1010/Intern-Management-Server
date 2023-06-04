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

const getAssignedList = (person_id, res) => {
    db.query(`SELECT s.id, up.full_name, c.class_name, up.image FROM student s, user_person up, class c, student_learn_intern si, intern_subject i, teacher t WHERE si.student_id=s.id AND s.user_id=up.id AND s.class_id=c.id AND si.subject_id=i.id AND i.teacher_id=t.id AND t.user_id=${person_id} AND si.is_learning=1`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result
            })
        }
    })
}

const getTodoListOfStudent = (student_id, user_id, res) => {
    const getAllTodos = id => {
        db.query(`SELECT * FROM detail_todo WHERE regular_id=${id}`, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err
                })
            } else {
                res.send({
                    statusCode: 200,
                    responseData: result,
                    extraData: id
                })
            }
        })
    }

    db.query(`SELECT r.id FROM regular_todo r, teacher t WHERE r.student_id=${student_id} AND t.user_id=${user_id} AND r.teacher_id=t.id`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err
            })
        } else {
            const regular_id = result[0].id;
            getAllTodos(regular_id);
        }
    })
}

const postTodo = (regular_id, todo_name, start_date, end_date, res) => {
    const formatedDate = date => {
        const convertedDate = new Date(Date.parse(date));
        return `${convertedDate.getUTCFullYear()}/${convertedDate.getMonth() + 1}/${convertedDate.getDate()}`;
    }

    db.query(`INSERT INTO detail_todo (todo_name, start_date, end_date, completed_status, out_of_expire, regular_id) VALUE ('${todo_name}', '${formatedDate(start_date)}', '${formatedDate(end_date)}', 0, 0, ${regular_id})`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: "Thêm công việc mới thành công"
                })
            }
        }
    })
}

const removeTodo = (id, res) => {
    db.query(`DELETE FROM detail_todo WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Gỡ bỏ công việc thành công'
                })
            }
        }
    })
}

const postTodoAppreciation = (id, content, res) => {
    const now = () => {
        const convertedDate = new Date();
        return `${convertedDate.getUTCFullYear()}/${convertedDate.getMonth() + 1}/${convertedDate.getDate()}`;
    }

    db.query(`INSERT INTO todo_appreciation (content, todo_id, created_at) VALUE ('${content}', ${id}, '${now()}')`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: "Gửi đánh giá công việc tới sinh viên thành công"
                })
            }
        }
    })
}

const getAllTodoAppreciation = (todo_id, res) => {
    db.query(`SELECT * FROM todo_appreciation WHERE todo_id=${todo_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result
            })
        }
    })
}

const removeAppreciation = (id, res) => {
    db.query(`DELETE FROM todo_appreciation WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Gỡ đánh giá khỏi công việc thành công'
                })
            }
        }
    })
}

module.exports = {
    getTeacher,
    getAssignedList,
    getTodoListOfStudent,
    postTodo,
    removeTodo,
    postTodoAppreciation,
    getAllTodoAppreciation,
    removeAppreciation
}