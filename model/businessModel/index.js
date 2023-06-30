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


const getBusinessId = async (token) => {
    try {
        console.log(token);
        const result = await new Promise((resolve, reject) => {
          db.query(`SELECT bs.id 
                    FROM business bs, user_account ua, user_person up 
                    WHERE bs.user_id = up.id and up.username = ua.username and ua.token = '${token}'`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
        console.log(result);
        return result[0]?.id;
      } catch (error) {
        console.log(error);
        return 0;
      }
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

const getAllrequest = async (businessId, searchRequest) => {
    try {
        return new Promise((resolve, reject) => {
            db.query(`
                select st.id, up.image, up.full_name, j.job_name, ij.job_id, ij.id AS keyInternJob, sc.school_name 
                from intern_job ij, job j, student st, user_person up, program p, school sc 
                where ij.job_id = j.id and j.business_id = ${businessId} 
                    and ij.student_id = st.id and st.user_id = up.id
                    and ij.submit_status = 0
                    and st.program_id = p.id and p.school_id = sc.id
                    and up.full_name LIKE '%${searchRequest}%';
            `, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    } catch (error) {
        console.log(error);
        throw error;
    } 
}

const aceptRequest = async (jobId, studentId, keyInternJob) => {
    try {

        return new Promise((resolve, reject) => {
            db.query(`
                UPDATE intern_job ij 
                SET ij.submit_status = TRUE, ij.is_interning = TRUE 
                WHERE ij.job_id = ${jobId} and ij.student_id = ${studentId} 
                    and ij.id = ${keyInternJob};
            `, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.affectedRows > 0) {
                        db.query(`UPDATE job SET vacancies = vacancies - 1 WHERE id = ${jobId}`, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        })
                    }
                }
            });
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllInternOfBusiness = async (businessId, searchIntern) => {
    try {
        return new Promise((resolve, reject) => {
            db.query(`
            SELECT sc.school_name , up.phone, up.email, ij.sent_require_time, up.address, up.full_name, j.job_name, ij.start_date, ij.id as 'key', st.id as 'studentId', ij.appreciation_file 
            FROM intern_job ij, job j, student st, user_person up, class cl, department dp, school sc
            WHERE ij.job_id = j.id and j.business_id = ${businessId} 
                and ij.student_id = st.id and st.user_id = up.id 
                and ij.submit_status = ${1} and st.class_id = cl.id 
                and cl.department_id = dp.id and dp.school_id = sc.id
                and up.full_name LIKE '%${searchIntern}%';
            `, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateIntern = async ({start_date, appreciation_file, key}) => {
    try {
        const query = `
            UPDATE intern_job
            SET start_date = '${start_date}', appreciation_file = '${appreciation_file}'
            WHERE id = ${key};
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

const getAllInterningStudent = async (businessId, searchIntern) => {
    try {
        return new Promise((resolve, reject) => {
            db.query(`
            SELECT up.image, up.full_name, j.job_name, ij.start_date, ij.is_interning, up.email, up.address, sc.school_name, up.phone
            FROM intern_job ij, student st, job j, user_person up, program p, school sc 
            WHERE ij.student_id = st.id AND j.business_id = ${businessId}
                AND ij.job_id = j.id AND st.user_id = up.id 
                AND ij.is_interning = 1 AND ij.submit_status = 1
                AND st.program_id = p.id and p.school_id = sc.id
                AND up.full_name LIKE '%${searchIntern}%';
            `, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
    db.query(
        `
            
        `, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err.toString()
                })
            } else {
                res.send({
                    statusCode: 200, 
                    responseData: result
                })
            }
        })
}

const getSubmitHistory = async (businessId) => {
    try {
        return new Promise((resolve, reject) => {
            db.query(`
                select st.id, up.image, up.full_name, j.job_name, ij.job_id, ij.id AS keyInternJob, sc.school_name, ij.start_date AS submit_date
                from intern_job ij, job j, student st, user_person up, program p, school sc 
                where ij.job_id = j.id and j.business_id = ${businessId} 
                    and ij.student_id = st.id and st.user_id = up.id
                    and st.program_id = p.id and p.school_id = sc.id
                    and ij.submit_status = 1 and ij.is_interning = 1;
            `, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    } catch (error) {
        console.log(error);
        throw error;
    } 
}

module.exports = {
    getBusinessInfo,
    getAllJobs,
    postNewJob,
    putJob,
    getSkillsOfJob,
    getBusinessId,
    getAllrequest,
    aceptRequest,
    getAllInternOfBusiness,
    updateIntern,
    getAllInterningStudent,
    getSubmitHistory
}