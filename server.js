// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));

// Only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
