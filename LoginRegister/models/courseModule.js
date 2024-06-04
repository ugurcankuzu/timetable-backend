const mongoose = require("mongoose");
const User = require("../models/userModule");
const Rooms = require("../models/roomModule")
const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    lecturer: { type: mongoose.Types.ObjectId, ref: "User" },
    room: { type: mongoose.Types.ObjectId, ref: "Rooms" },
    studentCount: { type: Number },
    capacity: { type: Number },
    semester: { type: Number },
  },
  { collection: "courses" }
);

const Courses = mongoose.model("Courses", courseSchema);

module.exports = Courses;
