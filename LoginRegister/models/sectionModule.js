const mongoose = require("mongoose");
const Departments = require("../models/departmentModule");
const sectionSchema = new mongoose.Schema(
  {
    sectionName: { type: String, required: true },
    correspondingDepartments: {
      type: [mongoose.Types.ObjectId],
      ref: "Departments",
    },
  },
  { collection: "sections" }
);

const Sections = mongoose.model("Sections", sectionSchema);

module.exports = Sections;
