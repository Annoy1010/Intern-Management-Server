const teacherModel = require("../../model/teacherModel");
const userModel = require("../../model/userModel");
const Joi = require('joi');

const getTeacherController = (req, res) => {
    teacherModel.getTeacher(req, res);
}

const getAssignedListController = (req, res) => {
    const person_id = req.query.person_id;
    teacherModel.getAssignedList(person_id, res);
}

const getTodoListOfStudentController = (req, res) => {
    const student_id = req.query.student_id;
    const user_id = req.query.user_id;
    teacherModel.getTodoListOfStudent(student_id, user_id, res);
}

const postTodoController = (req, res) => {
    const { regular_id, todo_name, start_date, end_date } = req.body;
    if (todo_name.trim() === "" || start_date === "" || end_date === "") {
        res.send({
            statusCode: 400,
            responseData: "Vui lòng điền đẩy đủ thông tin công việc"
        })
    } else {
        teacherModel.postTodo(regular_id, todo_name, start_date, end_date, res);
    }
}

const removeTodoController = (req, res) => {
    const id = req.query.id;
    teacherModel.removeTodo(id, res);
}

const postTodoAppreciationController = (req, res) => {
    const { id, content } = req.body;
    if (content.trim() === '') {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập đánh giá trước khi gửi'
        })
    } else {
        teacherModel.postTodoAppreciation(id, content, res);
    }
}

const getAllTodoAppreciationController = (req, res) => {
    const todo_id = req.query.todo_id;
    teacherModel.getAllTodoAppreciation(todo_id, res);
}

const removeAppreciationController = (req, res) => {
    const id = req.query.id;
    teacherModel.removeAppreciation(id, res);
}

const getStudentLearnIntern = async (req, res) => {
    try {
        const userId = await userModel.getUserId(req.headers.authorization);
        if (!userId) return res.status(403).json('Vui lòng đăng nhập trước');

        const schema = Joi.object({
            academic: Joi.number().default(0),
            semester: Joi.number().default(0),
        });

        const {error, value} = schema.validate(req.query);

        if (error) return res.status(401).json(error);

        const result = await teacherModel.getStudentLearnInternByUserId(userId, value.academic, value.semester);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.message});
    }
}

const saveScore = async (req, res) => {
    try {
        const userId = await userModel.getUserId(req.headers.authorization);
        if (!userId) return res.status(403).json('Vui lòng đăng nhập trước');

        const schema = Joi.array().items(
            Joi.object({
                score: Joi.number().integer().max(10).min(0),
                studentId: Joi.number().integer(),
                id: Joi.number().integer(),
            }),
        ).required();

        const {error, value} = schema.validate(req.body);
        if (error) return res.status(403).json(error);

        await teacherModel.saveScore(value);
        const data = await teacherModel.getStudentLearnInternByUserId(userId);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.message});
    }
}

module.exports = {
    getTeacherController,
    getAssignedListController,
    getTodoListOfStudentController,
    postTodoController,
    removeTodoController,
    postTodoAppreciationController,
    getAllTodoAppreciationController,
    removeAppreciationController,
    removeAppreciationController,
    getStudentLearnIntern,
    saveScore,
}