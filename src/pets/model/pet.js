const { mongoose } = require("../../configuration/dbConfig");

const petSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      require: true,
    },
    clinicId: {
      type: String,
      require: true,
    },
    staffId: {
      type: String,
      require: true,
    },
    speciesId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coatColor: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pets", petSchema, "pets");
