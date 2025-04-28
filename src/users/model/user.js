const { mongoose } = require("../../configuration/dbConfig");

const userSchema = new mongoose.Schema(
  {
    roleId: {
      type: String,
      require: true,
    },
    googleId: {
      type: String,
      default: "",
    },
    clinic: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema, "users");
