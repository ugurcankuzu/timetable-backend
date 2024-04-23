const express = require('express');
const { saveSchedule } = require('../controllers/scheduleController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post("/saveSchedule",verifyToken,saveSchedule); //verifyToken eklenecek sorun giderilecek.
module.exports = router;
