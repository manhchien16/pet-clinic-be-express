const { mongoose } = require("../../configuration/dbConfig");

const cLinicTypeSchema = new mongoose.Schema(
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

module.exports = mongoose.model("ClinicTypes", cLinicTypeSchema, "clinicTypes");
