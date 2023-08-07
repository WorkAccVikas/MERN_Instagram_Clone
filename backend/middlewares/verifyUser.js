const userModel = require("../model/User");

module.exports = async (req, res, next) => {
  try {
    const { userEmail } = req.body;
    // ACTION : check the user existence
    // NOTE : Search in field  : Case-sensitive
    // let exist = await userModel.findOne({ email: userEmail });
    // LEARN : Search in field  : In-case-sensitive : 1st way
    let exist = await userModel.findOne({
      email: { $regex: userEmail, $options: "i" },
    });
    req.user = exist;

    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
};
