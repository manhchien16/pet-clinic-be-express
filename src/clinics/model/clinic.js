const { mongoose } = require("../../configuration/dbConfig");

const cLinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    typeId: {
      type: String,
      require: true,
    },
    province: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    streetAddress: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clinics", cLinicSchema, "clinics");
