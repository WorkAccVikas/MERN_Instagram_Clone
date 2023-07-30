// New Way : In swagger project
const mongoose = require("mongoose");
const config = require("../config/config");
const { MONGOURI: connectionString } = require("../config/config");

const connection = () => {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("\n✅✅✅ Database connected ✅✅✅");
    })
    .catch((error) => {
      console.log("\n❌❌❌ Unable to connect to db ❌❌❌");
    });
};

module.exports = connection;
