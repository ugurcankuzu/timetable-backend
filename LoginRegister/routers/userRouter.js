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

route.get("/logout", logout);
route.post("/login", login_user);
route.post("/register", add_user);
route.get("/getUserDetails", verifyToken, get_one_user);
/**
route
  .route("/")
  .get(get_all_users)
  .post(add_user);
 
route.route("/:id")
.get(get_one_user)
.patch(update_user)
.delete(delete_user);
 */
module.exports = route;
