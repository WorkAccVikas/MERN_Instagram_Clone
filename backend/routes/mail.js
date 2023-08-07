const express = require("express");
const router = express.Router();
const { sendMail } = require("../helper/mailer");
const verifyUser = require("../middlewares/verifyUser");

// POINT : send mail to user
// DESC : Protected route : required valid email
router.post("/sendMail", verifyUser, sendMail);

module.exports = router;
