const majorModel = require("../../model/majorModel");

const getMajorOfDepartmentController = (req, res) => {
    majorModel.getMajorOfDepartment(req, res);
}


module.exports = {
    getMajorOfDepartmentController,
}