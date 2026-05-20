import mongoose from "mongoose";

export default mongoose.model(
  "Wishlist",
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  })
);
