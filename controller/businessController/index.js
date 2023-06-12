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

const handlePutJob = (req, res) => {
    const { id, job_desc, requirements, another_information, vacancies } = req.body;
    if (job_desc === '' || requirements === '' || another_information === '' || vacancies === '') {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin'
        })
    }
    if (Number.isInteger(Number.parseInt(vacancies)) && Number.parseInt(vacancies) > 0) {
        const data = {
            id,
            job_desc, 
            requirements, 
            another_information, 
            vacancies
        }
        businessModel.putJob(data, res);
    } else {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng kiểm tra thông tin Số lượng cần tuyển'
        })
    } 
    
}

const handleGetSkillsOfJob = (req, res) => {
    const job_id = req.query.job_id;
    businessModel.getSkillsOfJob(job_id, res);
}

const getAllrequest = async (req, res) => {
    try {
        const businessId = await businessModel.getBusinessId(req.headers.authorization);
        if ( !businessId ) return res.status(403).json('user was not found!');

        const result = await businessModel.getAllrequest(businessId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const aceptRequest = async (req, res) => {
    try {
        const businessId = await businessModel.getBusinessId(req.headers.authorization);
        if ( !businessId ) return res.status(403).json('user was not found!');

        const jobId = req.params.job_id;
        const studentId = req.body.studentId;
        const keyInternJob = req.body.keyInternJob;

        const result = await businessModel.aceptRequest(jobId, studentId, keyInternJob);

        if ( !result ) return res.status(400).json('failded!');

        return res.status(200).json('success');
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllInternOfBusiness = async (req, res) => {
    console.log(req.headers.authorization);
    const businessId = await businessModel.getBusinessId(req.headers.authorization);
    if ( !businessId ) return res.status(403).json('user was not found');

    const result = await businessModel.getAllInternOfBusiness(businessId);
    return res.status(200).json(result);
}

module.exports = {
    handleGetAllJobs,
    handleGetBusinessInfo,
    handlePostNewJob,
    handlePutJob,
    handleGetSkillsOfJob,
    getAllrequest,
    aceptRequest,
    getAllInternOfBusiness,
}