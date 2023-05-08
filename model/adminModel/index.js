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
            res.send({
                statusCode: 200,
                responseData: 'Thêm mới chương trình đào tạo thành công'
            })
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
            res.send({
                statusCode: 200,
                responseData: 'Chỉnh sửa chương trình đào tạo thành công'
            })
        }
    })
}

module.exports = {
    getSchool,
    getAllProgram,
    postNewProgram,
    editProgram
}