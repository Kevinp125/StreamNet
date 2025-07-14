const express = require("express")
const authRouter = require("./auth"); 
const userRouter = require("./users");
const connectionsRouter = require("./connections");
const notinterestedRouter = require("./notinterested");
const eventsRouter = require("./events");
const router = express.Router(); 

router.use("/auth", authRouter); //mount the requests in authRoute file to correspond to /auth
router.use("/users", userRouter);
router.use("/connections", connectionsRouter); 
router.use("/not-interested", notinterestedRouter);
router.use("/events", eventsRouter);

module.exports = router;
