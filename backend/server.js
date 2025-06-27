const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file
const express = require("express"); //importing express library
const cors = require("cors"); //allows for cross origin sharing. Since frontend is hosted on a port that isnt 3000 we need this enabled to express is able to send info back
const routes = require("./api/routes/index");

const app = express(); //creating an instance of the express application
app.use(cors()); //allows app to use cross origin sharing
app.use(express.json()); //tells Express to automatically parse incoming requests with Content-Type: application/json and put the parsed data on req.body

app.use("/api", routes); // all routes mounted here so they auto have /api in front of them which is important because that is what vercel needs to handle requests

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
