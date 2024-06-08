const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getAllSections,
  createSection,
  deleteSection,
} = require("../controllers/sectionController");

router.get("/getAllSections", verifyToken, getAllSections);
router.post("/createSection", verifyToken, createSection);
router.post("/deleteSection", verifyToken, deleteSection);

module.exports = router;
