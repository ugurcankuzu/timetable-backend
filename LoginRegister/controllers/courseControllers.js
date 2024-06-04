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
    console.log(req.body);
    const { courseName, lecturer, room, studentCount, semester, capacity } =
      req.body;

    if (courseName && lecturer) {
      const newCourse = new Courses({
        courseName: courseName,
        lecturer: new mongoose.Types.ObjectId(lecturer),
        room: null,
        studentCount: studentCount,
        capacity: capacity,
        semester: semester,
      });

      const savedCourse = await newCourse.save();
      if (savedCourse) {
        const updatedUser = await User.findByIdAndUpdate(
          lecturer,
          {
            $push: { courses: newCourse._id },
          },
          { new: true }
        );

        if (updatedUser) {
          const updatedCourses = await Courses.find().populate({
            path: "lecturer room",
            select:
              "_id name surname email freeTimes courses role roomName roomCapacity assignedCourse roomType",
          });
          return res
            .status(200)
            .json({ success: true, courses: updatedCourses });
        } else {
          // Eğer kullanıcı güncellenemezse, yeni oluşturulan kursu da sil
          await Courses.findByIdAndDelete(newCourse._id);
          return res.status(500).json({
            success: false,
            message: "Course created but can't updated user",
          });
        }
      } else {
        return res.status(500).json({
          success: false,
          message: "Course couldn't saved",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please fill fields correctly",
      });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const deleteCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { courseId, lecturerId } = req.body;
    console.log(req.body);
    const deleteCourse = await Courses.findByIdAndDelete(courseId);
    if (deleteCourse) {
      const user = await User.findById(lecturerId);
      user.courses.pull(courseId);
      const deleteFromUser = await user.save();

      if (deleteFromUser) {
        await session.commitTransaction();
        session.endSession();
      } else {
        throw new Error("Course Deleted but Couldn't Update User");
      }
    } else {
      throw new Error("Course couldn't deleted and user not updated");
    }
    const updatedCourses = await Courses.find().populate({
      path: "lecturer room",
      select:
        "_id name surname email freeTimes courses role roomName roomCapacity assignedCourse roomType",
    });
    return res.status(200).send({ success: true, courses: updatedCourses });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ success: false, message: e.message });
  }
};
module.exports = {
  getCoursesDetails,
  getAllCourses,
  createCourse,
  deleteCourse,
};
