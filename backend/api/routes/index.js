const express = require("express")
const authRouter = require("./auth"); 
const userRouter = require("./users");
const connectionsRouter = require("./connections");
const userActionsRouter = require("./userActions");
const router = express.Router(); 

router.use("/auth", authRouter); //mount the requests in authRoute file to correspond to /auth
router.use("/users", userRouter);
router.use("/connections", connectionsRouter); 
router.use("/user-actions", userActionsRouter);

module.exports = router;
