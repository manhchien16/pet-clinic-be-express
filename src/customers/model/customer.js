const { mongoose } = require("../../configuration/dbConfig");

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customers", customerSchema, "customers");
