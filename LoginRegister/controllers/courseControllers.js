const User = require("../models/userModule");
const Courses = require("../models/courseModule");
const getCoursesDetails = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).populate("courses");
  if (User) {
    res.json({
      success: true,
      courses: user.courses,
    });
  }
};

module.exports = {
  getCoursesDetails,
};
