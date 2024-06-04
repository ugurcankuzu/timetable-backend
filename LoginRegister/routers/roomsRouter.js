const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { getAllRooms } = require("../controllers/roomControllers");
const router = express.Router();

router.get("/getAllRooms", verifyToken, getAllRooms);

module.exports = router;
