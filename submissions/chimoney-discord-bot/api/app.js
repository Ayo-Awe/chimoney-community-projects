require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");

// Setup middleware
app.use(express.json());
app.use(helmet());
app.use(morgan());

// 404 route handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Resource Not Found",
    success: false,
  });
});

// Start express server
const port = process.env.port;
app.listen(port, () => console.log(`Listening on port ${port}`));
