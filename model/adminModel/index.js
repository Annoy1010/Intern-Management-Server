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

const getAllDepartment = (schoolId, res) => {
    db.query(`SELECT d.id, d.department_name, d.department_head, d.majors, up.full_name, d.school_id FROM department d, teacher t, user_person up WHERE d.department_head = t.id AND t.user_id = up.id AND d.school_id = ${schoolId}`, (err, result) => {
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

const postNewDepartment = (req, res) => {
    const department_name = req.body.department_name;
    const majors = req.body.majors;
    const school_id = req.body.school_id;
    db.query(`INSERT INTO department(department_name, department_head, school_id, majors) VALUE (N'${department_name}', null, ${majors}, ${school_id})`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows > 0) {
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
    const majors = req.body.majors;
    const department_head = req.body.department_head;
    const school_id = req.body.school_id;
    db.query(`UPDATE department SET department_name = N'${department_name}', majors = ${majors}, department_head = ${department_head}, school_id = ${school_id} WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows > 0) {
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


module.exports = {
    getSchool,
    getAllProgram,
    postNewProgram,
    editProgram,
    getAllDepartment,
    getAllTeachersInDepartment,
    postNewDepartment,
    editDepartment,
    getAllTeacher,
    postTeacherAccount,
    postTeacherPersonal,
    postTeacherDetail,
    putTeacherPersonal,
    putTeacherDetail,
}