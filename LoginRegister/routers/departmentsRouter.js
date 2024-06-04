const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getAllDepartments,
  createDepartment,
} = require("../controllers/departmentController");
router.get("/getAllDepartments", verifyToken, getAllDepartments);
router.post("/createDepartment", verifyToken, createDepartment);

module.exports = router;
