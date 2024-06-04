const Departments = require("../models/departmentModule");
const mongoose = require("mongoose");
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Departments.find({}).populate(
      "correspondingCourses"
    );
    if (departments) {
      return res.status(200).json({ success: true, departments: departments });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { departmentName, correspondingCourses } = req.body;
    if (departmentName && Array.isArray(correspondingCourses)) {
      const newDepartment = new Departments({
        departmentName: departmentName,
        correspondingCourses: correspondingCourses.map(
          (correspondingCourse) =>
            new mongoose.Types.ObjectId(correspondingCourse)
        ),
      });
      await newDepartment.save();
      const updatedDepartments = await Departments.find({}).populate(
        "correspondingCourses"
      );
      if (updatedDepartments) {
        return res
          .status(200)
          .json({ success: true, departments: updatedDepartments });
      }
    }
    return res.status(400).json({
      success: false,
      message: "Please provide department name and corresponding courses",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
};
