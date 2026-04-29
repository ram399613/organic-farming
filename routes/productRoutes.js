const express = require('express');
const router = express.Router();
const localStore = require('../localStore');
const { protect, authorize } = require('../middleware/auth');

// Get all products + filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, location } = req.query;
    const products = await localStore.getAllProducts({ category, search, location });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await localStore.getProductById(req.params.id);
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
    const product = await localStore.createProduct({ ...req.body, farmerId: req.user._id });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update product
router.put('/:id', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const product = await localStore.updateProduct(req.params.id, req.body, req.user._id);
    res.json(product);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    await localStore.deleteProduct(req.params.id, req.user._id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

module.exports = router;
