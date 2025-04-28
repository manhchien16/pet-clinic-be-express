const { mongoose } = require("../../configuration/dbConfig");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Roles", roleSchema, "roles");
