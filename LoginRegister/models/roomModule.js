const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true },
    roomCapacity: { type: Number, required: true },
    assignedCourse: { type: mongoose.Types.ObjectId, ref: "Courses" },
    roomType: { type: String, required: true },
  },
  { collection: "rooms" }
);

const Rooms = mongoose.model("Rooms", roomSchema);
module.exports = Rooms;
