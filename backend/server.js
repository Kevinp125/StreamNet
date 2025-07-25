const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const routes = require("./api/routes/index");
const {
  startGeneralNotificationScheduler,
} = require("./services/notificationScheduler");

const { startNudgeScheduler } = require("./services/nudgeScheduler");
const { initializeWebSocketServer } = require("./websocket/websocketServer");

const app = express(); //creating an instance of the express application
const server = http.createServer(app); //express normally handles this automatically but we need to do it manually so that we cn attach server obejct to websocket
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json()); //tells Express to automatically parse incoming requests with Content-Type: application/json and put the parsed data on req.body

app.use("/api", routes); // all routes mounted here so they auto have /api in front of them which is important because that is what vercel needs to handle requests

initializeWebSocketServer(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on the same port ${PORT}`);
  startGeneralNotificationScheduler();
  startNudgeScheduler();
});

module.exports = app;
