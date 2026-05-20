import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    // Filter out deals products (numeric IDs) from stock updates
    const validProducts = req.body.products.filter(item =>
      /^[a-f\d]{24}$/i.test(item.product) // Only include valid ObjectIds
    );

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      ...req.body,
    });

    // Update product quantities only for real database products
    for (const item of validProducts) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    res.json({ order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });

  // Ensure all orders have shippingAddress and paymentMethod fields with proper defaults
  const updatedOrders = orders.map(order => {
    const orderObj = order.toObject();

    // Ensure shippingAddress exists and has all required properties
    if (!orderObj.shippingAddress) {
      orderObj.shippingAddress = {
        name: 'N/A',
        address: 'N/A',
        city: 'N/A',
        state: 'N/A',
        zipCode: 'N/A',
        phone: 'N/A',
        email: 'N/A'
      };
    } else {
      // Ensure all properties exist and are not empty
      orderObj.shippingAddress = {
        name: orderObj.shippingAddress.name || 'N/A',
        address: orderObj.shippingAddress.address || 'N/A',
        city: orderObj.shippingAddress.city || 'N/A',
        state: orderObj.shippingAddress.state || 'N/A',
        zipCode: orderObj.shippingAddress.zipCode || 'N/A',
        phone: orderObj.shippingAddress.phone || 'N/A',
        email: orderObj.shippingAddress.email || 'N/A'
      };
    }

    // Ensure paymentMethod exists
    if (!orderObj.paymentMethod) {
      orderObj.paymentMethod = 'N/A';
    }

    return orderObj;
  });

  res.json(updatedOrders);
};
