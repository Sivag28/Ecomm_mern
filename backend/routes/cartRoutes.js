import express from "express";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Save cart to DB
router.post("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = req.body.cart;
  await user.save();
  res.json(user.cart);
});

// Get saved cart
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.product");
  res.json(user.cart);
});

export default router;
