const { mongoose } = require("../../configuration/dbConfig");

const categorySchema = new mongoose.Schema(
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

module.exports = mongoose.model("Categories", categorySchema, "categories");
