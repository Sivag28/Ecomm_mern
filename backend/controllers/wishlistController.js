import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) {
      return res.json({ products: [] });
    }
    res.json({ products: wishlist.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist)
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });

  const index = wishlist.products.indexOf(req.params.id);

  if (index > -1) wishlist.products.splice(index, 1);
  else wishlist.products.push(req.params.id);

  await wishlist.save();
  res.json(wishlist);
};
