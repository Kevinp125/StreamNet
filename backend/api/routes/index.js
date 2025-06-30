const express = require("express")
const authRouter = require("./auth"); 
const router = express.Router(); 

router.use("/auth", authRouter); //mount the requests in authRoute file to correspond to /auth

module.exports = router;
