const Section = require("../models/sectionModule");
const mongoose = require("mongoose");

const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find({}).populate(
      "correspondingDepartments"
    );
    if (sections) {
      return res.status(200).json({ success: true, sections: sections });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const createSection = async (req, res) => {
  try {
    const { sectionName, correspondingDepartments } = req.body;
    if (sectionName && Array.isArray(correspondingDepartments)) {
      const section = new Section({
        sectionName: sectionName,
        correspondingDepartments: correspondingDepartments.map(
          (departmentId) => new mongoose.Types.ObjectId(departmentId)
        ),
      });
      await section.save();
      const updatedSections = await Section.find({}).populate(
        "correspondingDepartments"
      );
      if (updatedSections) {
        return res
          .status(200)
          .json({ success: true, sections: updatedSections });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide section name and corresponding departments",
      });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
const deleteSection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { sectionId } = req.body;
    const section = await Section.findByIdAndDelete(sectionId);
    if (!section) {
      throw new Error("Couldn't find Section");
    }
    const updatedSections = await Section.find({});
    return res.status(200).json({ success: true, sections: updatedSections });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: e.message });
  }
};
module.exports = {
  createSection,
  getAllSections,
  deleteSection,
};
