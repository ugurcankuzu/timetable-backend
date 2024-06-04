const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createCourse,
  getCoursesDetails,
  getAllCourses,
} = require("../controllers/courseControllers");

router.get("/getCoursesByUser", verifyToken, getCoursesDetails);
router.get("/getAllCourses", verifyToken, getAllCourses);
router.post("/createCourse", verifyToken, createCourse);

module.exports = router;
