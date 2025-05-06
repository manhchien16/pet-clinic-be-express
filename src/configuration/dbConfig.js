const mongoose = require("mongoose");
const config = require("config");
require("dotenv").config();

mongoose.set("bufferCommands", false);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  const uri = config.get("db.mongodb");
  const opts = {
    serverSelectionTimeoutMS: 2000, // 10s  primary
    socketTimeoutMS: 2000, // 10s inactivity
    dbName: process.env.DB_NAME,
  };

  try {
    await mongoose.connect(uri, opts);
    console.log("✅  MongoDB connected");
  } catch (err) {
    console.error("❌  Could not connect to MongoDB:", err.message);
    throw err;
  }
}

/* --- Graceful shutdown --- */
async function gracefulExit() {
  try {
    await mongoose.connection.close();
    console.log("💤  MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during MongoDB shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

module.exports = { mongoose, connectDB };
