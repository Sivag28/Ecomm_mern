import mongoose from "mongoose";

export default mongoose.model(
  "Order",
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: Array,
    totalAmount: Number,
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
      email: String
    },
    paymentMethod: String,
    isPaid: { type: Boolean, default: false },
    status: { type: String, default: "Order Placed" }
  }, { timestamps: true })
);
