const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');

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
        return result[0].id;
      } catch (error) {
        console.log(error);
        return 0;
      }
  }

const getJobsByBusinessId = async (businessId) => {
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM job WHERE business_id = ${businessId}`, (err, result)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        return result;
    } catch (err) {
        console.log(error);
        return 0;
    }
}

const addJob = async (newJob, businessId) => {
    try {
        const {name, img, desc, requirement, anotherInfo, vacancies} = newJob;
        console.log(newJob);
        const result = await new Promise((resolve, reject) => {
            db.query(`INSERT INTO job (image, job_name, job_desc, requirements, another_information, vacancies, business_id) 
                      values ('${img}', '${name}', '${desc}', '${requirement}', '${anotherInfo}', '${vacancies}', ${businessId})`, 
                      (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getAllJobs = async () => {
    try {        
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM job`, (err, result)=> {
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

const getAllrequest = async (businessId) => {
    try {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT s.id, up.image, up.full_name, j.job_name, ij.job_id, ij.id AS keyInternJob
                FROM business b, job j, intern_job ij, student s, user_person up
                WHERE b.id = 4 and b.id = j.business_id and j.id = ij.job_id and ij.student_id = s.id and s.user_id = up.id 
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
                SET ij.submit_status = TRUE 
                WHERE ij.job_id = ${jobId} and ij.student_id = ${studentId} and ij.id = ${keyInternJob};
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

module.exports = {
    getJobsByBusinessId,
    addJob,
    getBusinessId,
    getAllJobs,
    getAllrequest,
    aceptRequest,
}