const { mongoose } = require("../../configuration/dbConfig");

const speciesSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Species", speciesSchema, "species");
