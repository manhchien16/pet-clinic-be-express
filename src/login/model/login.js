const { mongoose } = require("../../configuration/dbConfig");

const loginSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'Users'
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Login", loginSchema, "login");
