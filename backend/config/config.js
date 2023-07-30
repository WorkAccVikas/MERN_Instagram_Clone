if (process.env.NODE_ENV.toLowerCase() === "production") {
  module.exports = require("./prod"); // production environment configuration file
} else if (process.env.NODE_ENV.toLowerCase() === "development") {
  module.exports = require("./dev"); // development environment configuration file
}
