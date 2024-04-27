const User = require("../models/userModule");
const Courses = require("../models/courseModule");
const getCoursesDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate("courses");
    if (user) {
      return res.json({
        success: true,
        courses: user.courses,
      });
    } else {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
  } catch (e) {
    return res.status(500).json({ success: false, msg: e.message });
  }
};

module.exports = {
  getCoursesDetails,
};
