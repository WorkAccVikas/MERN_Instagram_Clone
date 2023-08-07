const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    expireToken: Date,
    profile_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dbxgos2wd/image/upload/v1691242324/q7es1iojuvgi8kf9qglv.webp",
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtual: true } }
);

const User = mongoose.model("User", UserSchema, "User");

module.exports = User;
