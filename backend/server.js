const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const routes = require("./api/routes/index");
const {
  startGeneralNotificationScheduler,
} = require("./services/notificationScheduler");

const app = express(); //creating an instance of the express application
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json()); //tells Express to automatically parse incoming requests with Content-Type: application/json and put the parsed data on req.body

app.use("/api", routes); // all routes mounted here so they auto have /api in front of them which is important because that is what vercel needs to handle requests

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.status(200).send("hello");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startGeneralNotificationScheduler();
});

module.exports = app;
