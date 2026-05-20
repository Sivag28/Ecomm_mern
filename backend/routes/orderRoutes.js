import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrders
} from "../controllers/orderController.js";

const router = express.Router();

// Place order
router.post("/", auth, createOrder);

// Get order history
router.get("/", auth, getOrders);

export default router;
