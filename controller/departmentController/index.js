const departmentModel = require("../../model/departmentModel");

const getDepartmentController = (req, res) => {
    departmentModel.getDepartment(req, res);
}


module.exports = {
    getDepartmentController,
}