const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');

function hashPass(pass) {
    var hash = crypto.createHash('sha256');
    return hash.update(pass).digest('hex');
}

const getALLStudents = (req, res) => {
    db.query(`SELECT s.user_id, s.id as student_id, ps.image, ps.full_name, s.dob, ps.email, ps.address, s.class_id, c.class_name, s.major_id, d.id, s.current_status FROM student s, user_person ps, class c, department d WHERE s.user_id = ps.id and c.department_id = d.id and s.class_id = c.id`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
}

const addStudent = (req, res) => {
    const { image,
            full_name,
            dob,
            email,
            address,
            department_id,
            class_id,
            major_id } = req.body;
    const pass = hashPass('123456');

    db.query(`SELECT email FROM user_person WHERE email = '${email}'`, (err, result) => {
        if(result.length != 0){
            res.send({
                statusCode: 400,
                responseData: 'Email đã được sử dụng, vui lòng sử dụng email khác',
            });
        } else{
            db.query(`INSERT INTO user_account (username, pass, permission_id) values ('${email}', '${pass}', 3)`, (err, result) => {
                if(err){
                    console.log(err)
                }else{
                    db.query(`INSERT INTO user_person (username, full_name, image, phone, email, address) values ('${email}', '${full_name}', '${image}', '${0987654321}', '${email}', '${address}')`, (err, result) => {
                        if(err){
                            console.log(err)
                        }else{
                            db.query(`INSERT INTO student (admission_date, dob, sex, current_status, user_id, program_id, major_id, class_id) values ('${'2023-06-06'}', '${dob}', ${1}, ${1}, ${result.insertId}, ${1}, ${major_id}, ${class_id})`, (err, result) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    res.send({
                                        statusCode: 200,
                                        responseData: `Bạn đã thêm sinh viên ${full_name} thành công`,
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

}

const updateStudent = (req, res) => {
    const { image,
        full_name,
        dob,
        email,
        address,
        department_id,
        class_id,
        major_id } = req.body.newStudent;
    const id = req.body.user_id;
    db.query(`SELECT email FROM user_person WHERE email = '${email}' and id != ${id}`, (err, result) => {
        if(result.length != 0){
            res.send({
                statusCode: 401,
                responseData: 'Email đã được sử dụng, vui lòng sử dụng email khác',
            });
        } else{
            db.query(`UPDATE student SET dob = '${dob}', class_id = ${class_id}, major_id = ${major_id} WHERE user_id = ${id}`, (err, result) => {
                if(err){
                    console.log(err);
                }else{
                    db.query(`UPDATE user_person SET full_name = '${full_name}', email = '${email}', address = '${address}', image = '${image}' WHERE id = ${id}`, (err, result) => {
                        if(err){
                            console.log(err);
                        }else{
                            res.send({
                                statusCode: 200,
                                responseData: 'Cập nhật thành công',
                            });
                        }
                    });
                }
            });
        }
    });
}

const deleteStudent = (req, res) => {
    const user_id = req.body.user_id;
    const username = req.body.username;
    console.log(req.body);
    db.query(`DELETE FROM student WHERE user_id = ${user_id}`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            db.query(`DELETE FROM user_person WHERE id = ${user_id}`, (err, result) => {
                if(err){
                    console.log(err);
                }else{
                    db.query(`DELETE FROM user_account WHERE username = '${username}'`, (err, result) => {
                        if(err){
                            console.log(err);
                        }else{
                            res.send({
                                statusCode: 200,
                                responseData: 'Xóa sinh viên thành công',
                            });
                        }
                    });
                }
            });
        }
    });
}

const getStudentOfYear = (req, res) => {
    const year = req.query.year;
    db.query(`SELECT s.user_id, s.id as student_id, ps.image, ps.full_name, s.dob, ps.email, ps.address, s.class_id, c.class_name, s.major_id, d.id, s.current_status FROM student s, user_person ps, class c, department d WHERE s.user_id = ps.id and c.department_id = d.id and s.class_id = c.id and YEAR(admission_date) = ${year}`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
}

const getUserId = async (token) => {
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(`
                SELECT st.id FROM student st, user_account ua, user_person up
                WHERE st.user_id = up.id and up.username = ua.username and ua.token = '${token}'
            `,(err, result) => {
                if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
            });
        });
        return result[0].id;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const saveRequestJobIntern = async (userId, jobId, dataJob) => {
    try {
        const result = new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO intern_job (start_date, submit_status, sent_require_time, job_id, student_id, appreciation_file) VALUES (?, ?, ?, ?, ?, ?)',
              [dataJob.startDate, false, dataJob.sendRequireTime, jobId, userId, dataJob.appriciationFile],
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const saveJobInterest = async (studentId, jobId) => {
    try {
        const dateString = new Date().toISOString().substring(0, 10);
        const result = new Promise((resolve, reject) => {
            db.query(`
                INSERT INTO job_favorite (creation_date, student_id, job_id)
                values ('${dateString}', ${studentId}, ${jobId})`, (err, result) => {
                    if (err) 
                        reject(err);
                    else
                        resolve(result);
            })
        });
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getJobInterested = async (studentId) => {
    try {     
        const result = new Promise((resolve, reject) => {
            db.query(`
                SELECT * FROM job j, job_favorite jf, business bs, user_person up
                WHERE j.id = jf.job_id and jf.student_id = ${studentId} and j.business_id = bs.id and up.id = bs.user_id`, (err, result) => {
                    if ( err ) reject(err);
                    else resolve(result);
            });
        });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

module.exports = {
    getALLStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentOfYear,
    getUserId,
    saveRequestJobIntern,
    saveJobInterest,
    getJobInterested,
}