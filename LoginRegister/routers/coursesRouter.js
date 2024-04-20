const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getCoursesDetails } = require("../controllers/courseControllers");

router.get("/getCoursesByUser", verifyToken, getCoursesDetails);

module.exports = router;
