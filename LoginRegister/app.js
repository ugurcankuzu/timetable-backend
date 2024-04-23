const express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const connectDB = require("./db/connect");
require("dotenv").config();
const userRoute = require("./routers/userRouter");
const courseRoute = require("./routers/coursesRouter");
const defultRoute = require("./routers/defaultRoute");
const scheduleRoute = require("./routers/scheduleRouter");
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

app.use(defultRoute);

const start = async () => {
  await connectDB(process.env.HOST_NAME);
  app.listen(process.env.PORT || 5000, () => {
    console.log("your server is up in port 5000...");
  });
};
start();
