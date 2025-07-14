const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

router.route("/").post(authenticateMiddleware, (req, res) => {






  
})





module.exports = router;