if (process.env.NODE_ENV?.toLowerCase() === "development") {
  module.exports = require("./dev"); // development environment configuration file
} else {
  module.exports = require("./prod"); // production environment configuration file
}
