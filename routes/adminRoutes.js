const express = require('express');
const router = express.Router();
const localStore = require('../localStore');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', async (req, res) => {
  try {
    const stats = await localStore.getAdminStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/approve-farmer/:id', async (req, res) => {
  try {
    const user = await localStore.approveFarmer(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
