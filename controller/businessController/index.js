const businessModel = require("../../model/businessModel");

const handleGetBusinessInfo = (req, res) => {
    const user_id = req.query.user_id;
    businessModel.getBusinessInfo(user_id, res);
}

const handleGetAllJobs = (req, res) => {
    const business_id = req.query.business_id;
    businessModel.getAllJobs(business_id, res);
}

const handlePostNewJob = (req, res) => {
    const data = req.body;
    const existedEmptyValue = Object.keys(data).some(item => data[`${item}`] === '' || data[`${item}`].length === 0 || data[`${item}`] === null)
    if (existedEmptyValue) {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin'
        })
    } else {
        if (Number.isInteger(Number.parseInt(data.vacancies)) && Number.parseInt(data.vacancies) > 0) {
            businessModel.postNewJob(data, res);
        } else {
            res.send({
                statusCode: 400,
                responseData: 'Vui lòng kiểm tra thông tin Số lượng cần tuyển'
            })
        }
    }
}

const handleGetSkillsOfJob = (req, res) => {
    const job_id = req.query.job_id;
    businessModel.getSkillsOfJob(job_id, res);
}

module.exports = {
    handleGetAllJobs,
    handleGetBusinessInfo,
    handlePostNewJob,
    handleGetSkillsOfJob
}