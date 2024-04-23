const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    lecturerId: { type: mongoose.Types.ObjectId, ref: "user" },
    availability: [{
        day: { type: String, required: true },
        hour: { type: String, required: true }
    }]
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
