import express from "express";
import {
  getProducts,
  getDeals,
  getProductById
} from "../controllers/productController.js";

const router = express.Router();

// Get all products + search + filter
router.get("/", getProducts);

// Deals / offers
router.get("/deals", getDeals);

// Get single product by ID
router.get("/:id", getProductById);

export default router;
