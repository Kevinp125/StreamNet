const express = require("express")
const authRouter = require("./auth"); 
const userRouter = require("./users");
const router = express.Router(); 

router.use("/auth", authRouter); //mount the requests in authRoute file to correspond to /auth
router.use("/user", userRouter);

module.exports = router;
