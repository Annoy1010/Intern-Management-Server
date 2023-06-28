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

    const createTodoPlace = () => {
        db.query(`SELECT id FROM teacher WHERE user_id=${user_id}`, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err
                })
            } else {
                const teacher_id = result[0].id;
                db.query(`INSERT INTO regular_todo (student_id, teacher_id) VALUES (${student_id}, ${teacher_id})`, (err, result) => {
                    if (err) {
                        res.send({
                            statusCode: 400,
                            responseData: err
                        })
                    } else {
                        const regular_id = result.insertId;
                        getAllTodos(regular_id)
                    }
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
            if (result.length > 0) {
                const regular_id = result[0].id;
                getAllTodos(regular_id);
            } else {
                createTodoPlace()
            }
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

const getStudentLearnInternByUserId = async (userId, academicId = 0, semesterId = 0) => {
    try {
        const query = `
            SELECT upst.id as 'userIdstudent', st.id as 'studentId', cl.id as 'classId', dp.id as 'departmentId', 
                isb.id as 'internSubId', sli.id as 'studentLearnInternId', upst.*, st.*, cl.*, dp.*, isb.*, sli.*
            FROM user_person upst, student st, class cl, department dp, intern_subject isb, user_person uptc, teacher tc, student_learn_intern sli
            WHERE upst.id = st.user_id and st.class_id = cl.id and cl.department_id = dp.id and st.id = sli.student_id
                and sli.subject_id = isb.id and isb.teacher_id = tc.id and tc.user_id = uptc.id and uptc.id = ${userId} 
                and (isb.academic_year = ${academicId} OR ${academicId} = 0) and (isb.semester_id = ${semesterId} OR ${semesterId} = 0);;
        `;  
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    } catch (e) {
        throw e;
    }
}

const saveScore = async (scores) => {
    try {
        const promises = scores.map(({ id, score }) => {
            const query = `
                UPDATE student_learn_intern
                SET score = ?
                WHERE id = ?
            `;
            return new Promise((resolve, reject) => {
                db.query(query, [score, id], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
          });
          const results = await Promise.all(promises);
          return results;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getTeacher,
    getAssignedList,
    getTodoListOfStudent,
    postTodo,
    removeTodo,
    postTodoAppreciation,
    getAllTodoAppreciation,
    removeAppreciation,
    getStudentLearnInternByUserId,
    saveScore,
}