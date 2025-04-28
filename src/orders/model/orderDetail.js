const { mongoose } = require("../../configuration/dbConfig");

const orderDetailSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      require: true,
    },
    customerId: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OrderDetails",
  orderDetailSchema,
  "orderDetails"
);
