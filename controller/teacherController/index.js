const teacherModel = require("../../model/teacherModel");

const getTeacherController = (req, res) => {
    teacherModel.getTeacher(req, res);
}


module.exports = {
    getTeacherController,
}