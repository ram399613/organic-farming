const express = require('express');
const router = express.Router();
const localStore = require('../localStore');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/farmers', async (req, res) => {
  try {
    const farmers = localStore.users.filter(u => u.role === 'farmer');
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/approve-farmers/:id', async (req, res) => {
  try {
    const user = await localStore.approveFarmer(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
