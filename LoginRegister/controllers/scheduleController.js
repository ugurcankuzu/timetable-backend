const Schedule = require('../models/scheduleModule');

const saveSchedule = async (req, res) => {
    try {
        const { lecturerId, availability } = req.body;

        
        const schedule = new Schedule({
            lecturerId: lecturerId,
            availability: availability
        });
        await schedule.save();

        res.status(201).json({ success: true, msg: "Schedule saved successfully" });
    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).json({ success: false, msg: "Error saving schedule" });
    }
};

module.exports = {
    saveSchedule
};
