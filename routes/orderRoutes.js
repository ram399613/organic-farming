const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const order = await Order.create({ userId: req.user._id, products, totalAmount });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find(req.user.role === 'admin' ? {} : { userId: req.user._id })
      .populate('products.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
