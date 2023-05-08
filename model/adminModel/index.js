const db = require('../../store');

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
    db.query(`SELECT * FROM department d WHERE d.school_id = ${schoolId}`, (err, result) => {
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

module.exports = {
    getSchool,
    getAllProgram,
    postNewProgram,
    editProgram,
    getAllDepartment,
    getAllTeachersInDepartment,
    postNewDepartment,
    editDepartment,
}