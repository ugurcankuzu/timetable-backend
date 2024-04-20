const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    lecturer: { type: mongoose.Types.ObjectId, ref: "user" },
    room: { type: mongoose.Types.ObjectId, ref: "rooms" },
    studentCount: { type: Number },
    semester: { type: Number },
  },
  { collection: "courses" }
);

const Courses = mongoose.model("Courses", courseSchema);

module.exports = Courses;
