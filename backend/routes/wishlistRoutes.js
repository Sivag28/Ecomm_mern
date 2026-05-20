import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getWishlist, toggleWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

// Get wishlist
router.get("/", auth, getWishlist);

// Add / Remove wishlist
router.post("/:id", auth, toggleWishlist);

export default router;
