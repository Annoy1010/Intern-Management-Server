const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function hashPass(pass) {
    var hash = crypto.createHash('sha256');
    return hash.update(pass).digest('hex');
}

const handleLoginDataModel = (data, res) => {
    const hashedPass = hashPass(data.pass);
    db.query(`SELECT pass FROM user_account WHERE username='${data.username}' and pass='${hashedPass}'`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length !== 0 ) {
                const token = jwt.sign({username: data.username }, 'secret_key');
                res.send({
                    statusCode: 200,
                    responseData: token
                })
            } else {
                res.send({
                    statusCode: 400,
                    responseData: 'Tên đăng nhập hoặc mật khẩu không chính xác',
                });
            }
        }
    })
}

const updateToken = (data, res) => {
    const { username, token } = data;
    db.query(`UPDATE user_account SET token='${token}' WHERE username='${username}'`, (err, result) => {
        if (err) {

        } else {
            if (result.affectedRows > 0) {
                res.send({
                    statusCode: 200,
                    responseData: 'Tạo mới token thành công'
                });
            }
        }
    })
}

const getUserData = (query, res) => {
    db.query(`SELECT * FROM user_account WHERE token='${query.token}'`, (err, result) => {
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

const resetToken = (res) => {
    db.query(`UPDATE user_account SET token=''`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err,
            })
        } else {
            res.send({
                statusCode: 200,
                responseData: 'Đăng xuất thành công',
            })
        }
    })
}

module.exports = {
    handleLoginDataModel,
    updateToken,
    getUserData,
    resetToken,
}