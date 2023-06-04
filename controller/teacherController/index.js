const teacherModel = require("../../model/teacherModel");

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

module.exports = {
    getTeacherController,
    getAssignedListController,
    getTodoListOfStudentController,
    postTodoController,
    postTodoAppreciationController,
    getAllTodoAppreciationController
}