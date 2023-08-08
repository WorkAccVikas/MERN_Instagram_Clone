const express = require("express");
const router = express.Router();

// Define routes for the root path '/'
router.get("/", (req, res) => {
  // Your code for the root path '/'
  // console.log("Users");
  res.json({ msg: "Users" });
});

// ... Other routes ...

module.exports = router;
