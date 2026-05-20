import express from "express";
import { addReview, getProductReviews, checkUserReview } from "../controllers/reviewController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Add review to product
router.post("/:id/reviews", auth, addReview);

// Get reviews for a product
router.get("/:id/reviews", getProductReviews);

// Check if user has reviewed a product
router.get("/:id/check-review", auth, checkUserReview);

export default router;
