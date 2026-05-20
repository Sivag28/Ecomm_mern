import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    console.log('Review submission data:', { rating, comment, productId, userId: req.user?.id });

    // Validate required fields
    if (!rating || !comment || !productId) {
      return res.status(400).json({ message: "Rating, comment, and product ID are required" });
    }

    // Check if productId is a valid ObjectId (real database products)
    // Deals products have numeric IDs and don't support reviews
    const isValidObjectId = /^[a-f\d]{24}$/i.test(productId);
    if (!isValidObjectId) {
      return res.status(400).json({ message: "Reviews are not supported for this product type" });
    }

    // Validate rating range
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create the review
    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating: numRating,
      comment
    });

    // Update product rating and review count
    const allReviews = await Review.find({ product: productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / allReviews.length;
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: "Failed to add review" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate product ID
    if (!productId || productId === 'undefined') {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: "Failed to get reviews" });
  }
};

export const checkUserReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // Validate product ID
    if (!productId || productId === 'undefined') {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if productId is a valid ObjectId (real database products)
    // Deals products have numeric IDs and don't have reviews
    const isValidObjectId = /^[a-f\d]{24}$/i.test(productId);
    if (!isValidObjectId) {
      return res.json({ hasReviewed: false });
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId
    });

    res.json({ hasReviewed: !!existingReview });
  } catch (error) {
    console.error('Check user review error:', error);
    res.status(500).json({ message: "Failed to check review status" });
  }
};
