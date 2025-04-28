const { mongoose } = require("../../configuration/dbConfig");
const { PaymentStatus, PaymentMethod } = require("../enums/payment.enum");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.COD,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", paymentSchema, "payments");
