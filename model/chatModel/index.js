const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');
const { Console } = require('console');

const getUserId = async (token) => {
    try {
        const query = `SELECT up.id FROM user_account ua, user_person up
                        WHERE ua.token = '${token}' and ua.username = up.username`;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result[0].id);
            });
        });    
    } catch (e) {
        throw e;
    }
}

const getTeacher = async (userId) => {
    try {
        const query = `
            SELECT uptc.image, uptc.full_name as 'teacherName', uptc.id, st.user_id as 'userIdStudent', uptc.id as 'userIdTeacher', st.id as 'studentId', tc.id as 'teacherId'
            FROM student st, student_learn_intern sli, intern_subject isb, teacher tc, user_person uptc
            WHERE st.user_id = ${userId} and st.id = sli.student_id and sli.subject_id = isb.id
                and isb.teacher_id = tc.id and tc.user_id = uptc.id;
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    } catch (e) {
        throw e;
    }
}

const getConversationId = async (userId, studentId) => {
    try {
        const query = `
            SELECT cv.id, cv.student_id as 'studentId' FROM conversation cv, student st, teacher tc
            WHERE (st.user_id = ${userId} or tc.user_id = ${userId}) and ${studentId} = cv.student_id and cv.teacher_id = tc.id
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

    } catch (e) {
        console.log(e);
    }
}

const saveConversation = async (studentId, teacherId) => {
    try {
        const query = `
            INSERT INTO conversation (student_id, teacher_id)
            VALUES (${studentId}, ${teacherId});
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result.insertId);
            });
        });
    } catch (e) {
        console.log(e);
    }
}

const saveMessage = async (data, conversationId) => {
    try{
        const query = `
            INSERT INTO detail_conversation (content, attach_file, sent_time, conversation_id, user_id)
            values ('${data.content}', null, '${data.sentTime}', ${conversationId}, ${data.userId});
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result.insertId);
            });
        });
    } catch (e) {
        console.log(e);
    }
}

const getMessage = async (conversationId) => {
    try {
        const query = `
            SELECT content, attach_file as 'attachFile', CONVERT_TZ(sent_time, '+00:00', '+07:00') as 'sentTime', user_id as 'userId' FROM detail_conversation
            WHERE conversation_id = ${conversationId}
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

const getStudents = async (userId) => {
    try {
        const query = `
            SELECT upst.id as 'userIdStudent', st.id as 'studentId', upst.full_name as 'fullName', upst.image, tc.user_id as 'userIdTeacher', tc.id as 'teacherId'
            FROM teacher tc, intern_subject isb, student_learn_intern sli, student st, user_person upst
            WHERE tc.user_id = ${userId} and tc.id = isb.teacher_id and isb.id = sli.subject_id 
                and sli.student_id = st.id and st.user_id = upst.id;
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

const getStudentIdByUserId = async (userId) => {
    try {
        const query = `
            SELECT id FROM student WHERE user_id = ${userId}
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result[0].id);
            });
        });
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getTeacher,
    getUserId,
    getConversationId,
    saveConversation,
    saveMessage,
    getMessage,
    getStudents,
    getStudentIdByUserId,
}