const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schedule = require("./scheduleModule");
const {Schema} =require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    surname: {
      type: String,
      default: "",
    },
    courses: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Courses",
    },
    freeTimes: {
      type: Array,
      default: function() {
        return [[false]];
      }
    },
    role: {
      type: Number,
      default: 0,
    },
    schedule:{
      type: Schema.Types.ObjectId,
      ref: "Schedule",
    }
    
  },
  { collection: "user" }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
