const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
router.get("/getAllDepartments", verifyToken, getAllDepartments);
router.post("/createDepartment", verifyToken, createDepartment);
router.post("/deleteDepartment", verifyToken, deleteDepartment);

module.exports = router;
