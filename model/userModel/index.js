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

const getUserAccountData = (query, res) => {
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

const getUserPersonData = (query, res) => {
    db.query(`SELECT up.id, up.full_name, up.image, up.phone, up.email, up.address FROM user_person up, user_account ua WHERE ua.token='${query.token}' AND ua.username = up.username`, (err, result) => {
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

const getBusinessModel = (req, res) => {
    db.query(`SELECT bs.id, ac.username, ps.image, ps.phone, ps.email, ps.address, DATE_FORMAT(bs.establish_date, '%Y-%m-%d') as establish_date, bs.industry_sector, ps.full_name as company_name, bs.short_desc, bs.representator FROM business bs, user_account ac, user_person ps WHERE ac.username = ps.username and ps.id = bs.user_id`, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
            console.log(result);
        }
    })
}

const getBusinessByBusinessId = async (businessId) => {
    try {
        return new Promise((resolve, reject) => {
            db.query(`SELECT bs.id, ac.username, ps.image, ps.phone, ps.email, ps.address, DATE_FORMAT(bs.establish_date, '%Y-%m-%d') as establish_date, bs.industry_sector, ps.full_name as company_name, bs.short_desc, bs.representator FROM business bs, user_account ac, user_person ps WHERE ac.username = ps.username and ps.id = bs.user_id and bs.id = ${businessId}`, (err, result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}


const checkEmail = async (email) => {
    try {        
        const query = `SELECT * FROM user_person WHERE email = '${email}'`
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) 
                    reject(err);
                else 
                    resolve(result);

            })
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const checkUserName = async (username) => {
    try {        
        const query = `SELECT * FROM user_account WHERE username = '${username}'`
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) 
                    reject(err);
                else 
                    resolve(result);
            })
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const saveAccount = async (account) => {
    try {        
        const query = `INSERT INTO user_account (username, pass, permission_id) 
                        values ('${account.userName}', '${hashPass(account.pass)}', '${account.permissionsId}')`;

        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) 
                    reject(err);
                else 
                    resolve(result);
            })
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const savePerson = async (person) => {
    try {        
        const query = `INSERT INTO user_person (username, full_name, phone, image, email, address)
                        values ('${person.userName}', '${person.fullName}', '${person.phone}', '${person.image}', '${person.email}', '${person.address}')`;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) 
                    reject(err);
                else 
                    resolve(result);
            })
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

const saveBusiness = async (business) => {
    try {
        const date = new Date().toISOString().slice(0, 10);
        const query = `INSERT INTO business (establish_date, industry_sector, representator, short_desc, user_id)
                        values ('${business.establishDate}', '${business.industrySector}', '${business.representator}', '${business.shortDesc}', '${business.userId}')`;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) 
                    reject(err);
                else 
                    resolve(result);
            })
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}


const putBusinessModel = (data, res) => {
    const {id, address, email, establish_date, company_name, image, industry_sector, phone, representator, short_desc, username} = data;
    
    const updateProfileBusiness = () => {
        db.query(`UPDATE user_person SET address='${address}', image='${image}', email='${email}', full_name='${company_name}', phone='${phone}' WHERE username='${username}'`, (err, result) => {
            if (err) {
                res.send({
                    statusCode: 400,
                    responseData: err.toString(),
                })
            } else {
                if (result.affectedRows > 0) {
                    res.send({
                        statusCode: 200,
                        responseData: 'Lưu thay đổi thông tin doanh nghiệp thành công',
                    })
                }
            }
        })
    }

    db.query(`UPDATE business SET establish_date='${establish_date}', industry_sector='${industry_sector}', representator='${representator}', short_desc='${short_desc}' WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send({
                statusCode: 400,
                responseData: err.toString(),
            })
        } else {
            if (result.affectedRows > 0) {
                updateProfileBusiness();
            }
        }
    })
}

module.exports = {
    handleLoginDataModel,
    updateToken,
    getUserAccountData,
    getUserPersonData,
    resetToken,
    verifyEmailModel,
    checkEmail,
    checkUserName,
    saveAccount,
    savePerson,
    saveBusiness,
    getBusinessModel,
    putBusinessModel,
    getBusinessByBusinessId,
}