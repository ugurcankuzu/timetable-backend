const Rooms = require("../models/roomModule");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find({}).populate("assignedCourse");
    if (rooms.length > 0) {
      return res.status(200).json({ success: true, rooms: rooms });
    } else {
      return res.status(404).json({ success: false, rooms: [] });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { getAllRooms };
