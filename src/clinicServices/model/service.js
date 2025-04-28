const { mongoose } = require("../../configuration/dbConfig");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    categoryId: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    images: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Services", serviceSchema, "services");
