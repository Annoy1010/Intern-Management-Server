const db = require('../../store');
const crypto = require('crypto');

const getSchool = (email, res) => {
    db.query(`SELECT ad.school_id FROM user_person up, administrator ad WHERE ad.user_id = up.id AND up.email='${email}'`, (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            const schoolId = result[0].school_id;
            getFullDataOfSchool(schoolId);
        }
    })

    const getFullDataOfSchool = (schoolId) => {
        db.query(`SELECT * FROM school WHERE id=${schoolId}`, (err, result) => {
            if (err) {
                res.send({ 
                    statusCode: 400,
                    responseData: err,
                })
            } else {
                res.send({ 
                    statusCode: 200,
                    responseData: result[0],
                })
            }
        })
    }
}

const getAllProgram = (schoolId, res) => {
    db.query(`SELECT * FROM program p WHERE p.school_id = ${schoolId}`, (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({ 
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

const postNewProgram = (data, res) => {
    const program_name = data.program_name;
    const school_id = data.school_id;
    db.query(`INSERT INTO program (program_name, school_id) value(N'${program_name}', ${school_id})`, (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Thêm mới chương trình đào tạo thành công'
                })
            }
        }
    })
}

const editProgram = (data, res) => {
    const program_id = data.id;
    const program_name = data.program_name;
    const school_id = data.school_id;
    db.query(`UPDATE program SET program_name=N'${program_name}' WHERE id=${program_id} AND school_id=${school_id}`, (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Chỉnh sửa chương trình đào tạo thành công'
                })
            }
        }
    })
}

const getAcademicYear = (req, res) => {
    db.query('SELECT * FROM academic_year', (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result
            })
        }
    })
}

const getSemester = (req, res) => {
    db.query('SELECT * FROM semester', (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result
            })
        }
    })
}

const getAllDepartment = (schoolId, res) => {
    db.query(`SELECT * FROM department WHERE school_id = ${schoolId}`, (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({ 
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

const getDepartmentHead = (req, res) => {
    const department_head = req.query.department_head;
    db.query(`SELECT up.full_name, t.id FROM teacher t, user_person up WHERE t.user_id = up.id AND t.id=${department_head}`, (err, result) => {
        if (err) {
            res.send({ 
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.length > 0) {
                res.send({ 
                    statusCode: 200,
                    responseData: {
                        full_name: result[0].full_name,
                        id: result[0].id,
                    },
                })
            } else {
                res.send({ 
                    statusCode: 200,
                    responseData: {
                        full_name: 'Còn trống',
                        id: 0,
                    },
                })
            }
            
        }
    })
}

const getMajorByDepartment = (req, res) => {
    const department_id = req.query.department_id;
    db.query(`SELECT m.id, m.major_name, m.department_id FROM major m, department d WHERE m.department_id = d.id AND m.department_id = ${department_id}`, (err, result) => {
        if (err) {
            res.send({
                status: 400,
                responseData: err
            })
        } else {
            res.send({
                status: 200,
                responseData: result
            })
        }
    })
}

const removeMajor = (id, res) => {
    db.query(`DELETE FROM major WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                status: 400,
                responseData: err
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    status: 200,
                    responseData: 'Xóa thành công'
                })
            } else {
                res.send({
                    status: 400,
                    responseData: 'Xóa thất bại'
                })
            }
        }
    })
}

const getAllTeachersInDepartment = (req, res) => {
    const department_id = req.query.departmentId;
    db.query(`SELECT t.id, up.full_name FROM teacher t, user_person up WHERE t.user_id = up.id AND t.department_id=${department_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

const insertMajor = (major_item, department_id, successfulRows) => {
    db.query(`INSERT INTO major (major_name, department_id) VALUES (N'${major_item}', ${department_id})`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows) {
                successfulRows++;
            }
        }
    })
    return successfulRows;
}

const postNewDepartment = (req, res) => {
    const department_name = req.body.department_name;
    const major_list = req.body.major_list;
    const school_id = req.body.school_id;
    db.query(`INSERT INTO department(department_name, department_head, school_id, majors) VALUE (N'${department_name}', null, ${school_id}, 0)`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows > 0) {
                const department_id = result.insertId;
                for (let major_item of major_list) {
                    insertMajor(major_item, department_id);
                }
                res.send({
                    statusCode: 200,
                    responseData: 'Thêm mới dữ liệu khoa thành công',
                })
            }
        }
    })
}

const editDepartment = (req, res) => {
    const id = req.body.id;
    const department_name = req.body.department_name;
    const department_head = req.body.department_head;
    const school_id = req.body.school_id;
    const major_list = req.body.major_list;
    db.query(`UPDATE department SET department_name = N'${department_name}', department_head = ${department_head}, school_id = ${school_id} WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows > 0) {
                const department_id = id;
                for (let major_item of major_list) {
                    insertMajor(major_item, department_id);
                }
                res.send({
                    statusCode: 200,
                    responseData: 'Chỉnh sửa dữ liệu khoa thành công',
                })
               
            }
        }
    })
}

const getAllTeacher = (req, res) => {
    db.query("SELECT * FROM teacher t, user_person up WHERE t.user_id = up.id", (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

const postTeacherAccount = (username, res) => {
    function hashPass(pass) {
        var hash = crypto.createHash('sha256');
        return hash.update(pass).digest('hex');
    }

    db.query(`INSERT INTO user_account (username, pass, permission_id) VALUES ('${username}', '${hashPass('123456')}', 2)`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: username
            })
        }
    })
}

const postTeacherPersonal = (data, res) => {
    const username = data.username;
    const full_name = data.full_name;
    const image = data.image;
    const phone = data.phone;
    const email = data.email;
    const address = data.address;

    db.query(`INSERT INTO user_person (username, full_name, image, phone, email, address) VALUE ('${username}', N'${full_name}', '${image}', '${phone}', '${email}', N'${address}')`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result.insertId
            })
        }
    })
}

const postTeacherDetail = (data, res) => {
    const user_id = data.user_id;
    const dob = data.dob;
    const start_date = data.start_date;
    const education_level = data.education_level;
    const experience_year = data.experience_year;
    const current_status = data.current_status;
    const department_id = data.department_id;

    db.query(`INSERT INTO teacher (dob, start_date, education_level, experience_year, current_status, department_id, user_id) VALUE ('${dob}', '${start_date}', '${education_level}', ${experience_year}, ${current_status}, ${department_id}, ${user_id})`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: 'Thêm mới dữ liệu giảng viên thành công'
            })
        }
    })
}

const putTeacherPersonal = (data, res) => {
    const username = data.username;
    const full_name = data.full_name;
    const image = data.image;
    const phone = data.phone;
    const email = data.email;
    const address = data.address;

    db.query(`UPDATE user_person SET full_name = N'${full_name}', image = '${image}', phone = '${phone}', email = '${email}', address = N'${address}' WHERE username='${username}'`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            console.log(result)
            res.send({
                statusCode: 200,
                responseData: result
            })
        }
    })
}

const putTeacherDetail = (data, res) => {
    const convertDateToDB = (date) => {
        const createdDate = new Date(date);
        const convertedDate = `${createdDate.getFullYear()}/${createdDate.getMonth()}/${createdDate.getDate()}`;
        return convertedDate;
    }

    const username = data.username;
    const dob = data.dob;
    const start_date = data.start_date;
    const education_level = data.education_level;
    const experience_year = data.experience_year;
    const current_status = data.current_status;
    const department_id = data.department_id;

    db.query(`UPDATE teacher t, user_person up SET t.dob = '${convertDateToDB(dob)}', t.start_date = '${convertDateToDB(start_date)}', t.education_level = '${education_level}', t.experience_year = ${experience_year}, t.current_status = ${current_status}, t.department_id = ${department_id} WHERE t.user_id = up.id AND up.username = '${username}'`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: 'Chỉnh sửa dữ liệu giảng viên thành công'
            })
        }
    })
}

const postSubject = (data, res) => {
    const unit = data.unit;
    const sessions = data.sessions;
    const max_students = data.max_students;
    const teacher_id = data.teacher_id;
    const department_id = data.department_id;
    const academic_year = data.academic_year;
    const semester_id = data.semester_id;

    db.query(`INSERT INTO intern_subject (unit, sessions, max_students, teacher_id, department_id, semester_id, academic_year) VALUES (${unit}, ${sessions}, ${max_students}, ${teacher_id}, ${department_id}, ${semester_id}, ${academic_year})`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: 'Thêm mới môn học thành công',
            })
        }
    })
}

const putSubject = (data, res) => {
    const id = data.id;
    const unit = data.unit;
    const sessions = data.sessions;
    const max_students = data.max_students;
    const teacher_id = data.teacher_id;
    const department_id = data.department_id;
    const academic_year = data.academic_year;
    const semester_id = data.semester_id;

    db.query(`UPDATE intern_subject SET unit=${unit}, sessions=${sessions}, max_students=${max_students}, teacher_id=${teacher_id}, department_id=${department_id}, academic_year=${academic_year}, semester_id=${semester_id} WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (res.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Cập nhật dữ liệu môn học thành công',
                })
            }
        }
    })
}

const getAllSubject = (req, res) => {
    db.query('SELECT * FROM intern_subject', (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

const getSubjectBySemester = (semester_id, res) => {
    db.query(`SELECT * FROM intern_subject WHERE semester_id = ${semester_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

const getSubjectByAcademicYear = (academic_year, res) => {
    db.query(`SELECT * FROM intern_subject WHERE academic_year = ${academic_year}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

const getSubjectByAllFilter = (semester_id, academic_year, res) => {
    db.query(`SELECT * FROM intern_subject WHERE semester_id = ${semester_id} AND academic_year=${academic_year}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result,
            })
        }
    })
}

module.exports = {
    getSchool,
    getAllProgram,
    postNewProgram,
    editProgram,
    getAcademicYear,
    getSemester,
    getAllDepartment,
    getAllTeachersInDepartment,
    postNewDepartment,
    editDepartment,
    getDepartmentHead,
    getMajorByDepartment,
    removeMajor,
    getAllTeacher,
    postTeacherAccount,
    postTeacherPersonal,
    postTeacherDetail,
    putTeacherPersonal,
    putTeacherDetail,
    postSubject,
    putSubject,
    getAllSubject,
    getSubjectBySemester,
    getSubjectByAcademicYear,
    getSubjectByAllFilter
}