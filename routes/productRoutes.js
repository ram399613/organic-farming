const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// Get all products + filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, location } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).populate('farmerId', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmerId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product (Approved farmers only)
router.post('/', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    if (req.user.role === 'farmer' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Waiting for admin approval' });
    }
    const product = await Product.create({ ...req.body, farmerId: req.user._id });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
