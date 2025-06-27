const express = require("express")
const authRouter = require("./auth"); //import whatever routes we want to mount
const router = express.Router(); //making a router

router.use("/auth", authRouter); //mount the requests in authRoute file to correspond to /auth

module.exports = router;
