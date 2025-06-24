import express from "express";
const router = express.Router(); //making a router
//here you could import a controller (what actuall queries database)

router
  .route("/") // `/api/hello`
  .get((req, res) => res.send("Testing if pushing auto deploys"));

router //just an example .route appends whats in it to relative route. So if we mounted hello-route file to /hello this would be /hello/:Id
  .route("/:Id");
export default router;
