require("dotenv").config({ path: "../backend/.env" });

const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const config = require("./config/config");
const userRouter = require("./routes/users");
const loggingMiddleware = require("./middlewares/loggingMiddleware");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const mongoConnection = require("./connection/mongo_connection");
const userModel = require("./model/User");

const PORT = process.env.PORT || 8000;
// const environment = process.env.NODE_ENV?.toLowerCase() || "development";
const environment = process.env.NODE_ENV?.toLowerCase() || "production";
const mongoUrl = config.MONGOURI;

// POINT : MONGODB CONNECTION
mongoConnection();
console.log("\n", { environment, PORT, mongoUrl });

// POINT : DISABLE console.log when production : 1st way
// // Override console.log when NODE_ENV is "production"
// if (process.env.NODE_ENV.toLowerCase() === "production") {
//   console.log = function () {};
// }

// POINT : DISABLE console.log when production : 2nd way
// Middleware to disable console logging in production
// if (environment.toLowerCase() === "production") {
//   app.use((req, res, next) => {
//     console.log = function () {}; // Override console.log with an empty function
//     next();
//   });
// }

// POINT : DISABLE console.log when production : 2nd way
// TOPIC : Use the custom middleware for the entire application
app.use(loggingMiddleware);

// TOPIC : IST format function for morgan logging
morgan.token("custom-time", () => {
  const date = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);
  const formattedDate = date.toISOString().replace("T", " ").slice(0, -1);
  return formattedDate;
});

// TOPIC : Define the custom logging format
const customLoggingFormat =
  ":custom-time - :method :url :status :response-time ms";

// POINT : Apply morgan middleware with the custom format
app.use(morgan(customLoggingFormat));

// POINT : To read req.body data
app.use(express.json());

// POINT : CORS middleware
app.use(cors());

// POINT : add auth Route
app.use(authRoute);
// POINT : add post Route
app.use(postRoute);

// app.get("/", (req, res) => {
//   console.log("Root route");
//   return res.send("Hello World!");
// });

// app.use("/users", userRouter);

// POINT : Listening
app.listen(PORT, () =>
  console.log(`\n🚀🚀🚀 Server started at 👉 http://localhost:${PORT} 🚀🚀🚀`)
);
