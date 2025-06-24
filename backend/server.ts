import express from "express"; //importing express library
import cors from "cors"; //allows for cross origin sharing. Since frontend is hosted on a port that isnt 3000 we need this enabled to express is able to send info back
import routes from "./api/routes/index";
const app = express(); //creating an instance of the express application
app.use(cors()); //allows app to use cross origin sharing
app.use(express.json()); //tells Express to automatically parse incoming requests with Content-Type: application/json and put the parsed data on req.body

app.use("/api", routes); // all routes mounted here so they auto have /api in front of them which is important because that is what vercel needs to handle requests

app.get("/", (req, res) => {
  res.json("In home api route");
});
export default app;
