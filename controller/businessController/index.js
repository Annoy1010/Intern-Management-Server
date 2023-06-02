const businessModel = require("../../model/businessModel");

const getJobsController = async (req, res) => {
    const businessId = await businessModel.getBusinessId(req.headers.authorization);
    if (!businessId) {
        return res.send({
            statusCode: 403,
            responseData: 'Không tìm thấy thông tin doanh nghiệp',
        });
    }
    const data = await businessModel.getJobsByBusinessId(businessId);
    return res.send(data);
}

const getAllJobs = async (req, res) => {
    try {
        const result = await businessModel.getAllJobs();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const addJob = async (req, res) => {
    try {
        const newJob = req.body.newJob;
        const businessId = await businessModel.getBusinessId(req.body.token);

        if (!businessId) {
            return res.send({
                statusCode: 403,
                responseData: 'Không tìm thấy thông tin doanh nghiệp',
            });
        }
    
        if (newJob.name === '' || newJob.vacancies === '') {
            return res.send({
                statusCode: 403,
                responseData: 'Không được để trống phần tên hoặc số lượng!',
            });
        }

        const job = await businessModel.addJob(newJob, businessId);
    
        if (job) {
            return res.send({
                statusCode: 200,
                responseData: 'Thêm thành công',
            });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getJobsController,
    addJob,
    getAllJobs,
}