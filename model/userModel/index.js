const db = require('../../store');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');
const { Console } = require('console');

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

const verifyEmailModel = (email, res) => {
    const _email = email;
    db.query(`SELECT email FROM user_person WHERE email = '${_email}'`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length !== 0 ) {
                res.send({
                    statusCode: 200,
                    responseData: 'vui lòng xác nhận tài khoản của bạn, chúng tôi vừa gữi email xác nhận!',
                })
            } else {
                res.send({
                    statusCode: 400,
                    responseData: 'email bạn vừa nhập không chính xác, vui lòng nhập lại!',
                });
            }
        }
    })
}

const addBusiness = (Business, res) => {
    const username = Business.name;
    const pass = hashPass('123456');
    const permission_id = 4;
    const email = Business.email;
    const representator = Business.representator;
    const sector = Business.sector;
    const desc = Business.desc;
    const phone = Business.phone;
    const address = Business.address;
    db.query(`SELECT username FROM user_account WHERE username = '${username}'`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            if (result.length !== 0){
                res.send({
                    statusCode: 401,
                    responseData: 'Tên công ty hoặc email đã được sử dụng',
                })
            }else{
                db.query(`SELECT email FROM user_person WHERE email = '${email}'`, (err, result) => {
                    if(err){
                        console.log(err);
                    }else{
                        if (result.length !== 0){
                            res.send({
                                statusCode: 401,
                                responseData: 'Tên công ty hoặc email đã được sử dụng',
                            })
                        }else{
                            db.query(`INSERT INTO user_account (username, pass, permission_id) values ('${username}','${pass}', ${permission_id})`, (err, result) => {
                                if (err) {
                                    res.send({
                                        statusCode: 402,
                                        responseData: 'Tên công ty đã được sử dụng',
                                    }
                                );
                                } else {
                                    res.send({
                                            statusCode: 200,
                                            responseData: 'Lưu thành công',
                                        }
                                    );
                                }
                            })

                            db.query(`INSERT INTO user_person (username, full_name, phone, email, address) values('${username}', '${representator}', '${phone}', '${email}', '${address}')`, (err, result) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    db.query(`INSERT INTO business (establish_date ,industry_sector, representator, short_desc, user_id) VALUES('2023-01-01', '${sector}', '${representator}', '${desc}', ${result.insertId})`, (err, result) => {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log(result);
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

const getBusinessModel = (req, res) => {
    db.query(`SELECT bs.id, ac.username, ps.image, ps.phone, ps.email, ps.address, DATE_FORMAT(bs.establish_date, '%Y-%m-%d') as establish_date, bs.industry_sector, ps.full_name, bs.short_desc FROM business bs, user_account ac, user_person ps WHERE ac.username = ps.username and ps.id = bs.user_id`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
            console.log(result);
        }
    })
}

module.exports = {
    handleLoginDataModel,
    updateToken,
    getUserData,
    resetToken,
    verifyEmailModel,
    addBusiness,
    getBusinessModel,
}