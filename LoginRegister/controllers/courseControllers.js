const User = require("../models/userModule");
const Courses = require("../models/courseModule");
const Departments = require("../models/departmentModule");
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      courseName,
      lecturer,
      room,
      studentCount,
      semester,
      capacity,
      correspondingDepartment,
    } = req.body;

    if (courseName && lecturer && correspondingDepartment) {
      const newCourse = new Courses({
        courseName: courseName,
        lecturer: new mongoose.Types.ObjectId(lecturer),
        room: null,
        studentCount: studentCount,
        capacity: capacity,
        semester: semester,
      });

      const savedCourse = await newCourse.save({ session });
      if (!savedCourse) {
        throw new Error("Course couldn't be saved");
      }

      const updatedUser = await User.findByIdAndUpdate(
        lecturer,
        { $push: { courses: newCourse._id } },
        { new: true, session }
      );

      if (!updatedUser) {
        throw new Error("Course created but can't update user");
      }

      const updatedDepartment = await Departments.findByIdAndUpdate(
        correspondingDepartment,
        { $push: { correspondingCourses: newCourse._id } },
        { session }
      );

      if (!updatedDepartment) {
        throw new Error("Course created but can't update department");
      }

      await session.commitTransaction();
      session.endSession();

      const updatedCourses = await Courses.find().populate({
        path: "lecturer room",
        select:
          "_id name surname email freeTimes courses role roomName roomCapacity assignedCourse roomType",
      });

      return res.status(200).json({ success: true, courses: updatedCourses });
    } else {
      throw new Error("Please fill fields correctly");
    }
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: e.message });
  }
};

const deleteCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { courseId, lecturerId } = req.body;
    const deleteCourse = await Courses.findByIdAndDelete(courseId);

    if (deleteCourse) {
      const user = await User.findById(lecturerId);
      user.courses.pull(courseId);
      const deleteFromUser = await user.save();

      if (deleteFromUser) {
        const departments = await Departments.find({
          correspondingCourses: new mongoose.Types.ObjectId(courseId),
        });
        const deleteFromDepartment = departments.map(async (department) => {
          department.correspondingCourses.pull(courseId);
          await department.save();
        });
        if (await Promise.all(deleteFromDepartment)) {
          await session.commitTransaction();
          session.endSession();
        } else {
          throw new Error(
            "Course deleted and removed from user. But couldn't remove from department"
          );
        }
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

    return res.status(200).json({ success: true, courses: updatedCourses });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: e.message });
  }
};
module.exports = {
  getCoursesDetails,
  getAllCourses,
  createCourse,
  deleteCourse,
};
