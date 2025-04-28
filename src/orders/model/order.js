const { mongoose } = require("../../configuration/dbConfig");
const { OrderStatus } = require("../enums/orderStatus.enum");

const orderSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      require: true,
    },
    paymentId: {
      type: String,
      require: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    closeDate: {
      type: Date,
      require: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", orderSchema, "orders");
