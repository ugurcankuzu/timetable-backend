const mongoose = require("mongoose");
const Rooms = require("../models/roomModule");
const Courses = require("../models/courseModule");
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

const createRoom = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { roomName, roomType, roomCapacity } = req.body;
    if (roomName && roomType) {
      const newRoom = new Rooms({
        roomName: roomName,
        roomCapacity: roomCapacity,
        roomType: roomType,
        assignedCourse: null,
      });
      const savedRoom = await newRoom.save();
      if (!savedRoom) {
        throw new Error("Room couldn't be saved");
      }
      const updatedRooms = await Rooms.find().populate("assignedCourse");
      return res.status(200).json({ success: true, rooms: updatedRooms });
    }
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: e.message });
  }
};
const deleteRoom = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { roomId } = req.body;
    const deleteRoom = await Rooms.findByIdAndDelete(roomId);
    if (!deleteRoom) {
      throw new Error("Room Couldn't be deleted");
    }

    const assignedCourses = await Courses.find({
      room: new mongoose.Types.ObjectId(roomId),
    });
    const deletePromises = assignedCourses.map(async (course) => {
      course.room = null;
      await course.save();
    });
    const deletedFromCourses = await Promise.all(deletePromises);
    if (!deletedFromCourses) {
      throw new Error("Room Couldn't removed from related courses");
    }
    const updatedRooms = await Rooms.find().populate("assignedCourse");
    return res.status(200).json({ success: true, rooms: updatedRooms });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ success: false, message: e.message });
  }
};
module.exports = { getAllRooms, createRoom, deleteRoom };
