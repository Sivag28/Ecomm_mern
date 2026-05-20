import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const { search, category } = req.query;

  const filter = {};
  if (search) filter.name = new RegExp(search, "i");
  if (category) filter.category = category;

  res.json(await Product.find(filter));
};

export const getDeals = async (_, res) =>
  res.json(await Product.find({ deal: true }));

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};


