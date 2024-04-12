const express = require("express");
const {
  get_all_users,
  add_user,
  get_one_user,
  update_user,
  delete_user,
  login_user,
  logout,
} = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");
const route = express.Router();

route
  .route("/")
  .get(get_all_users)
  .post(add_user)
  .patch(update_user)
  .delete(delete_user);
route.get("/logout", logout);
route.route("/login").post(login_user);
route.route("/register").post(add_user);
route.route("/getUserDetails").get(verifyToken, get_one_user);

module.exports = route;
