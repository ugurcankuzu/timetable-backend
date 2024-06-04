const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true },
    correspondingCourses: { type: [mongoose.Types.ObjectId], ref: "Courses" },
  },
  { collection: "departments" }
);

const Departments = mongoose.model("Departments", departmentSchema);

module.exports = Departments;
