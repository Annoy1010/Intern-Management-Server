const Joi = require("joi");
const studentModel = require("../../model/studentModel");
const { Request, Response } = require("express");


const getAllStudentsController = (req, res) => {
    studentModel.getALLStudents(req, res);
}

const addStudentController = (req, res) => {
    const { image,
        full_name,
        dob,
        email,
        address,
        department_id,
        class_id,
        major_id } = req.body;
    if (full_name === "" || dob === "" || email === "" || address === "" || department_id === "" || class_id === "" || major_id === ""){
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin',
        });
    }else{
        studentModel.addStudent(req, res);
    }
}

const updateStudentController = (req, res) => {
    const { image,
        full_name,
        dob,
        email,
        address,
        department_id,
        class_id,
        major_id } = req.body.newStudent;
    const id = req.body.user_id;
    if (full_name === "" || dob === "" || email === "" || address === "" || department_id === "" || class_id === "" || major_id === ""){
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin',
        });
    }else{
        studentModel.updateStudent(req, res);
    }
}

const deleteStudentController = (req, res) => {
    studentModel.deleteStudent(req, res);
}

const getStudentOfYearController = (req, res) => {
    studentModel.getStudentOfYear(req, res);
}

const saveRequestJobIntern = async (req, res) => {
    try {
        const userId = await studentModel.getUserId(req.headers.authorization);
        if (!userId) return res.status(400).Json('user was not found!');
    
        const jobId = req.params.id;
        if(!jobId) return res.status(403).json('Job was not found');

        const date = new Date();

        const schema = Joi.object({
            startDate: Joi.date().iso().default(() => new Date().toISOString().slice(0, 19)),
            sendRequireTime: Joi.date().iso().default(() => new Date().toISOString().slice(0, 19)),
            appriciationFile: Joi.binary().required(),
        });

        const { error, value } = schema.validate(req.body);

        if ( error ) return res.status(400).json({detail: error.message});

        const result = await studentModel.saveRequestJobIntern(userId, jobId, value);

        if (!result) return res.status(400).json('failded');
        console.log(result);
        return res.status(200).json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ detail: error.message });
    }
}

const saveJobInterest = async (req, res) => {
    try {
        const studentId = await studentModel.getUserId(req.headers.authorization);

        if (!studentId) return res.status(403).json('user was not found');
    
        const jobId = req.params.id;
    
        const result = await studentModel.saveJobInterest(studentId, jobId);

        if (!result) return res.status(400).json('Something was wrong failded!');

        return res.status(200).json('success');
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getJobInterested = async (req, res) => {
    try {
        const studentId = await studentModel.getUserId(req.headers.authorization);
    
        if (!studentId) return res.status(403).json('user was not found');
    
        const result = await studentModel.getJobInterested(studentId);

        if (!result) return res.status(400).json('failded');

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        throw(error);
    }
}

module.exports = {
    getAllStudentsController,
    addStudentController,
    updateStudentController,
    deleteStudentController,
    getStudentOfYearController,
    saveRequestJobIntern,
    saveJobInterest,
    getJobInterested,
}