const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');
const { Console } = require('console');

function hashPass(pass) {
    var hash = crypto.createHash('sha256');
    return hash.update(pass).digest('hex');
}

const getStudentId = async (token) => {
    try {
        const query = `SELECT st.id FROM user_account ua, user_person up, student st
                        WHERE ua.token = '${token}' and ua.username = up.username and up.id = st.user_id`;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result[0]?.id);
            });
        });    
    } catch (e) {
        throw e;
    }
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

const getStudentIdByUserId = (user_id, res) => {
    db.query(`SELECT * FROM student WHERE user_id = ${user_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: result[0].id
            })
        }
    })
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
                    db.query(`INSERT INTO user_person (username, full_name, image, phone, email, address) values ('${email}', '${full_name}', '${image}', '0987654321', '${email}', '${address}')`, (err, result) => {
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

const getDepartmentIdOfStudent = (student_id, res) => {
    db.query(`SELECT d.id FROM department d, major m, student s WHERE s.major_id = m.id AND m.department_id = d.id AND s.user_id = ${student_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            const department_id = result[0];
            res.send({
                statusCode: 200,
                responseData: department_id
            })
        }
    })
}

const getAllOpeningSubject = (year, month, department_id, res) => {
    let currentAcademicYear = year;
    let currentSemester = month >= 8 ? 1 : 2;
    if (month >= 8) {
        currentAcademicYear++;
    }

    const getAllSubjectDetail = (year_id) => {
        db.query(`SELECT i.id, i.unit, i.sessions, i.max_students, up.full_name, d.department_name FROM intern_subject i, user_person up, teacher t, department d WHERE i.teacher_id=t.id AND t.user_id=up.id AND d.id=i.department_id AND i.academic_year=${year_id} AND i.department_id=${department_id} AND i.semester_id=${currentSemester}`, (err, result) => {
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

    db.query(`SELECT id FROM academic_year WHERE current_year=${currentAcademicYear}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            const year_id = result[0].id;
            getAllSubjectDetail(year_id);
        }
    })
}

const checkRegistLearnSubjectRequest = (student_id, res) => {
    const handleRequestPending = () => {
        db.query(`SELECT * FROM student_learn_intern si, student s WHERE si.student_id=s.id AND s.user_id=${student_id} AND si.regist_status = 0`, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err.toString()
                })
            } else {
                if (result.length > 0) {
                    res.send({
                        statusCode: 400,
                        responseData: 'Bạn đã đăng ký môn học trước đó. Vui lòng chờ xác nhận hoặc xóa yêu cầu trước khi đăng ký lớp học khác'
                    })
                } else {
                    db.query(`SELECT id FROM student WHERE user_id=${student_id}`, (err, result) => {
                        if (err) {
                            res.send({
                                statusCode: 400,
                                responseData: err.toString()
                            })
                        } else {
                            res.send({
                                statusCode: 200,
                                responseData: result[0].id
                            })
                        }
                    })
                }
            }
        })
    }

    db.query(`SELECT * FROM student_learn_intern si, student s WHERE si.student_id=s.id AND s.user_id=${student_id} AND si.passed_status = 1`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            if (result.length > 0) {
                res.send({
                    statusCode: 400,
                    responseData: 'Bạn đã hoàn thành môn học. Để cải thiện điểm, vui lòng liên hệ với Khoa để được hỗ trợ'
                })
            } else {
                handleRequestPending();
            }
        }
    })
}

const postRegistLearnSubjectRequest = (student_id, subject_id, res) => {
    const date = new Date();
    const currentDate = `${date.getUTCFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    db.query(`INSERT INTO student_learn_intern(passed_status, regist_date, regist_status, student_id, subject_id) VALUE (0, '${currentDate}', 0, ${student_id}, ${subject_id})`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: 'Bạn đã đăng ký thành công. Vui lòng chờ hệ thống xác nhận để được ghi danh vào lớp học'
            })
        }
    })
}

const getRegistedSubjectInfo = (req, res) => {
    const user_id = req.query.user_id;
    db.query(`SELECT l.id, l.score, l.passed_status, l.regist_date, l.regist_status, up.full_name FROM student_learn_intern l, student s, user_person up, intern_subject i, teacher t WHERE l.student_id=s.id AND s.user_id=${user_id} AND l.subject_id=i.id AND i.teacher_id=t.id AND t.user_id=up.id`, (err, result) => {
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

const deleteRegistSubject = (id, res) => {
    db.query(`DELETE FROM student_learn_intern WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Bạn đã gỡ yêu cầu đăng ký môn học thành công'
                })
            }
        }
    })
}

const postRegistInternJobRequest = (req, res) => {
    const student_id = req.body.student_id;
    const job_id = req.body.job_id;
    const date = new Date();
    const currentDate = `${date.getUTCFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    const postRequest = () => {
        db.query(`INSERT INTO student_request_regist_intern (student_id, job_id, regist_submit_status, regist_date) VALUE (${student_id}, ${job_id}, 2, '${currentDate}')`, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err.toString()
                })
            } else {
                if (result.affectedRows > 0) {
                    res.send({
                        statusCode: 200,
                        responseData: 'Bạn đã gửi yêu cầu thông tin công việc thành công'
                    })
                }
            }
        })
    }

    const checkPendingRequest = () => {
        db.query(`SELECT * FROM student_request_regist_intern WHERE student_id=${student_id} AND  regist_submit_status=2`, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err.toString()
                })
            } else {
                if (result.length > 0) {
                    res.send({
                        statusCode: 400,
                        responseData: 'Bạn không thể gửi yêu cầu khi có yêu cầu đang được chờ xác nhận'
                    })
                } else {
                    postRequest();
                }
            }
        })
    }

    const handlePostRequest = () => {
        db.query(`SELECT * FROM student_request_regist_intern WHERE student_id=${student_id} AND regist_submit_status=1`, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err.toString()
                })
            } else {
                if (result.length > 0) {
                    res.send({
                        statusCode: 400,
                        responseData: 'Bạn không thể gửi yêu cầu khi đã có yêu cầu được xác nhận thành công'
                    })
                } else {
                    checkPendingRequest();
                }
            }
        })
    }
    
    handlePostRequest();
}

const getAllRegistInternJobRequest = (student_id, res) => {
    db.query(`SELECT sr.id, up.full_name as company_name, j.job_name, sr.regist_submit_status, sr.regist_date FROM student_request_regist_intern sr, job j, business b, user_person up WHERE sr.student_id=${student_id} AND sr.job_id=j.id AND j.business_id=b.id AND b.user_id=up.id`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            res.send({ 
                statusCode: 200, 
                responseData: result,
            });
        }
    })
}

const getAllRequestJobIntern = (student_id, res) => {
    db.query(`SELECT sr.id, up.full_name as company_name, j.job_name, sr.submit_status, sr.sent_require_time 
                FROM intern_job sr, job j, business b, user_person up 
                WHERE sr.student_id = ${student_id} AND sr.job_id=j.id 
                    AND j.business_id=b.id AND b.user_id=up.id`, (err, result) => {
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

const deleteRegistInternJobRequest = (id, res) => {
    db.query(`DELETE FROM student_request_regist_intern WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Gỡ bỏ yêu cầu thông tin công việc thành công'
                })
            } else {
                res.send({
                    statusCode: 400,
                    responseData: 'Gỡ yêu cầu không thành công'
                })
            }
        }
    })
}

const getAllJobs = (req, res) => {
    db.query(`SELECT * FROM job WHERE vacancies > 0`, (err, result) => {
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

const getJobInLibraryOfStudent = (student_id, job_id, res) => {
    db.query(`SELECT * FROM job_favorite WHERE student_id=${student_id} AND job_id=${job_id}`, (err, result) => {
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

const postJobToLibrary = (student_id, job_id, res) => {
    const date = new Date();
    const currentDate = `${date.getUTCFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    db.query(`INSERT INTO job_favorite (creation_date, student_id, job_id) VALUES ('${currentDate}', ${student_id}, ${job_id})`,  (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: 'Bạn đã lưu công việc vào thư viện thành công'
            })
        }
    })
}

const getAllJobsInLibrary = (student_id, res) => {
    db.query(`SELECT j.id, j.job_name, j.image, j.job_desc, j.requirements, j.another_information, j.business_id, j.vacancies FROM job j, job_favorite jf WHERE jf.student_id=${student_id} and j.id=jf.job_id`, (err, result) => {
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

const deleteJobFromLibrary = (student_id, job_id, res) => {
    db.query(`DELETE FROM job_favorite WHERE student_id=${student_id} AND job_id=${job_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString()
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Bạn đã gỡ bỏ công việc này khỏi thư viện thành công'
                })
            } else {
                res.send({
                    statusCode: 400,
                    responseData: 'Yêu cầu gỡ công việc không thành công'
                })
            }
        }
    }) 
}

const getCareJob  = (student_id, res) => {
    db.query(`SELECT jf.student_id, jf.job_id, j.job_name, up.full_name as company_name, b.industry_sector, j.job_desc FROM job_favorite jf, job j, business b, user_person up WHERE jf.student_id=${student_id} AND jf.job_id=j.id AND j.business_id=b.id AND b.user_id=up.id`, (err, result) => {
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

const getAllTodoOfStudent = (student_id, res) => {
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

    db.query(`SELECT id FROM regular_todo WHERE student_id=${student_id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            const regular_id = result[0]?.id;
            getAllTodos(regular_id);
        }
    })
}

const updateTodoOfStudent = (id, end_date, res) => {
    db.query(`UPDATE detail_todo SET completed_status = 1, out_of_expire=${new Date() > new Date(Date.parse(end_date)) ? 1 : 0} WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Bạn vừa hoàn thành xong công việc này',
                })
            }
        }
    })
}

const saveReport = async ({result_file, result_business_file, result_teacher_file, sent_time}, studentId) => {
    try {
        const query = `
            INSERT INTO  report (report_file, result_business_file, result_teacher_file, sent_time, student_id)
            VALUES ('${result_file}', '${result_business_file}', '${result_teacher_file}', '${sent_time}', ${studentId})
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result[0]?.id);
            });
        }); 
    } catch (e) {
        throw e;
    }
}

const deleteReport = async (studentId) => {
    try {
        const query = `
            DELETE FROM report WHERE student_id = ${studentId}
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result[0]?.id);
            });
        }); 
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getALLStudents,
    getStudentIdByUserId,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentOfYear,
    getAllOpeningSubject,
    getDepartmentIdOfStudent,
    checkRegistLearnSubjectRequest,
    postRegistLearnSubjectRequest,
    getRegistedSubjectInfo,
    deleteRegistSubject,
    postRegistInternJobRequest,
    getAllRegistInternJobRequest,
    deleteRegistInternJobRequest,
    getAllJobs,
    getJobInLibraryOfStudent,
    postJobToLibrary,
    getAllJobsInLibrary,
    deleteJobFromLibrary,
    getCareJob,
    getAllTodoOfStudent,
    updateTodoOfStudent,
    getAllRequestJobIntern,
    getStudentId,
    saveReport,
    deleteReport,
}