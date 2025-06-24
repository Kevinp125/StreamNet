import express from "express";
import helloRoute from "./hello-route" //import whatever routes we want to mount
const router = express.Router(); //making a router

router.use("/hello", helloRoute); //mount the requests in helloRoute file to correspond to /hello

export default router;