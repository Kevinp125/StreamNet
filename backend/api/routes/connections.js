const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router


//Route will add a connection to the database table 
router.route("/add").post(authenticateMiddleware, async (req, res) => {



})



module.exports = router;