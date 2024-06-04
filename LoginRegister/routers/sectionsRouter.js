const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getAllSections,
  createSection,
} = require("../controllers/sectionController");

router.get("/getAllSections", verifyToken, getAllSections);
router.post("/createSection", verifyToken, createSection);

module.exports = router;
