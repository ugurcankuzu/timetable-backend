const Departments = require("../models/departmentModule");
const Sections = require("../models/sectionModule");
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { departmentName, correspondingCourses, sectionIds } = req.body;

    if (!departmentName || !Array.isArray(correspondingCourses)) {
      throw new Error(
        "Please provide department name and corresponding courses"
      );
    }

    const newDepartment = new Departments({
      departmentName: departmentName,
      correspondingCourses: correspondingCourses.map(
        (correspondingCourse) =>
          new mongoose.Types.ObjectId(correspondingCourse)
      ),
    });

    const savedDepartment = await newDepartment.save({ session });
    if (!savedDepartment) {
      throw new Error("Failed to save the new department");
    }

    const updatePromises = sectionIds.map(async (sectionId) => {
      const section = await Sections.findById(sectionId).session(session);
      if (!section) {
        throw new Error(`Section not found for id ${sectionId}`);
      }

      section.correspondingDepartments.push(newDepartment._id);
      return section.save({ session });
    });

    const savedSection = await Promise.all(updatePromises);
    if (!savedSection) {
      throw new Error("Failed to save the section");
    }

    await session.commitTransaction();
    session.endSession();

    const updatedDepartments = await Departments.find({}).populate(
      "correspondingCourses"
    );
    if (!updatedDepartments) {
      throw new Error("Failed to fetch updated departments");
    }

    return res
      .status(200)
      .json({ success: true, departments: updatedDepartments });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: e.message });
  }
};

const deleteDepartment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { departmentId } = req.body;
    const deleteDepartment = await Departments.findByIdAndDelete(departmentId);
    if (deleteDepartment) {
      const relatedSectionByDepartments = await Sections.find({
        correspondingDepartments: new mongoose.Types.ObjectId(departmentId),
      });

      const deleteFromSections = relatedSectionByDepartments.map(
        async (section) => {
          section.correspondingDepartments.pull(departmentId);
          await section.save();
        }
      );
      const removeFromSection = await Promise.all(deleteFromSections);
      if (removeFromSection) {
        await session.commitTransaction();
        session.endSession();
      } else {
        throw new Error("department couldn't removed from sections");
      }
    } else {
      throw new Error("Department couldn't deleted and Section not updated");
    }
    const updatedDepartments = await Departments.find().populate(
      "correspondingCourses"
    );
    return res
      .status(200)
      .json({ success: true, departments: updatedDepartments });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: e.message });
  }
};
module.exports = {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
};
