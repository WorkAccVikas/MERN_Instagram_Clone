const jwt = require("jsonwebtoken");
const userModel = require("../model/User");
const { JWT_SECRET } = require("../config/config");

// POINT : middleware for check valid user and its token
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // ACTION : Authorization not present in headers
    if (!authorization) {
      return res.status(401).json({ error: "You must be logged in !!!" });
    }
    const token = authorization.split(" ")[1];
    try {
      // ACTION : Decode jwt token
      let decodeToken = await jwt.verify(token, JWT_SECRET);
      // ACTION : destructer _id from decodeToken
      const { _id } = decodeToken;
      // ACTION : Find user data by _id in jwt token
      const userData = await userModel.findById({ _id });
      req.user = userData;
    } catch (error) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Internal Server Error` });
  }
};
