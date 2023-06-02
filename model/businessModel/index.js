const db = require('../../store');

const getBusinessInfo = (user_id, res) => {
    db.query(`SELECT * FROM business WHERE user_id=${user_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            res.send({ 
                statusCode: 200, 
                responseData: result[0]
            })
        }
    })
}

const getAllJobs = (business_id, res) => {
    db.query(`SELECT * FROM job WHERE business_id=${business_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            res.send({ 
                statusCode: 200, 
                responseData: result,
            })
        }
    })
}

const postNewJob = (job, res) => {
    const postSkill = (skill_name, job_id) => {
        db.query(`INSERT INTO skill (skill_name, job_id) VALUES (N'${skill_name}', ${job_id})`, (err) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err.toString()
                })
            }
        })
    }

    db.query(`INSERT INTO job (image, job_name, job_desc, requirements, another_information, business_id, vacancies) VALUE ('${job.image}', N'${job.job_name}', N'${job.job_desc}', N'${job.requirements}', N'${job.another_information}', ${job.business_id}, ${job.vacancies})`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            const job_id = result.insertId;
            const skills = job.skills;
            for (let i = 0; i < skills.length; i++) {
                postSkill(skills[i].skill_name, job_id);
            }
            res.send({
                statusCode: 200,
                responseData: 'Thêm công việc mới thành công'
            })
        }
    })
}

const putJob = (data, res) => {
    const { id, job_desc, requirements, another_information, vacancies } = data;
    db.query(`UPDATE job SET job_desc='${job_desc}', requirements='${requirements}', another_information='${another_information}', vacancies=${Number.parseInt(vacancies)} WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200, 
                    responseData: 'Lưu thay đổi thông tin công việc thành công',
                })
            }
        }
    })
}

const getSkillsOfJob = (job_id, res) => {
    db.query(`SELECT * FROM skill WHERE job_id = ${job_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
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
    getBusinessInfo,
    getAllJobs,
    postNewJob,
    putJob,
    getSkillsOfJob
}