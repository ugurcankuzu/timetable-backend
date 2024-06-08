const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { getAllRooms, createRoom, deleteRoom } = require("../controllers/roomControllers");
const router = express.Router();

router.get("/getAllRooms", verifyToken, getAllRooms);
router.post("/createRoom", verifyToken, createRoom);
router.post("/deleteRoom", verifyToken, deleteRoom);

module.exports = router;
