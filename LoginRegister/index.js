const express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const bodyParser = require("body-parser");
const connectDB = require("./db/connect");
require("dotenv").config();
const userRoute = require("./routers/userRouter");
const courseRoute = require("./routers/coursesRouter");
const roomRoute = require("./routers/roomsRouter");
const defultRoute = require("./routers/defaultRoute");
const scheduleRoute = require("./routers/scheduleRouter");
const departmentRoute = require("./routers/departmentsRouter");
const sectionRoute = require("./routers/sectionsRouter");
const cors = require("cors");
const verifyToken = require("./middleware/verifyToken");
const app = express();

//json parse
app.use(express.json());
//cookis parser
app.use(cookieParser());
//sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cors());

// app use route
app.use("/api/user", userRoute);
app.use(verifyToken);
app.use("/api/courses", courseRoute);
app.use("/api/schedule", scheduleRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/departments", departmentRoute);
app.use("/api/sections/", sectionRoute);
app.use(defultRoute);

const start = async () => {
  await connectDB(process.env.HOST_NAME);
  app.listen(process.env.PORT || 5000, () => {
    console.log("your server is up in port 5000...");
  });
};
start();
