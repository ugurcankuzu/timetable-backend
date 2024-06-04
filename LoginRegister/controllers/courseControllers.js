const User = require("../models/userModule");
const Courses = require("../models/courseModule");
const mongoose = require("mongoose");
const getCoursesDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate({
      path: "courses",
      populate: {
        path: "room",
        select: "roomName",
      },
    });
    if (user) {
      return res.json({
        success: true,
        courses: user.courses,
      });
    } else {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
  } catch (e) {
    return res.status(500).json({ success: false, msg: e.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find().populate({
      path: "lecturer room",
      select:
        "_id name surname email freeTimes courses role roomName roomCapacity assignedCourse roomType",
    });
    if (courses.length > 0) {
      return res.json({
        success: true,
        courses: courses,
      });
    } else {
      return res.status(404).json({ success: false, msg: "Courses Not Found" });
    }
  } catch (e) {
    return res.status(500).json({ success: false, msg: e.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { courseName, lecturer, room, studentCount, semester, capacity } =
      req.body;
    if (courseName && lecturer && studentCount && capacity && semester) {
      const newCourse = new Courses({
        courseName: courseName,
        lecturer: new mongoose.Types.ObjectId(lecturer),
        room: null,
        studentCount: studentCount,
        capacity: capacity,
        semester: semester,
      });
      await newCourse.save();
      const updatedCourses = await Courses.find().populate({
        path: "lecturer room",
        select:
          "_id name surname email freeTimes courses role roomName roomCapacity assignedCourse roomType",
      });
      return res.status(200).json({ success: true, courses: updatedCourses });
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide all the fields correctly.",
      });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
module.exports = {
  getCoursesDetails,
  getAllCourses,
  createCourse,
};
