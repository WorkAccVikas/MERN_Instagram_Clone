function loggingMiddleware(req, res, next) {
  // Check if NODE_ENV is 'production'
  if (process.env.NODE_ENV?.toLowerCase() === "production") {
    // Override the 'console.log' function to do nothing
    console.log = function () {};
  }

  // Continue with the next middleware or route handler
  next();
}

module.exports = loggingMiddleware;
