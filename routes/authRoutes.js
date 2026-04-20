const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    
    const isFarmer = role === 'farmer';
    const user = await User.create({ name, email, password, role: isFarmer ? 'farmer' : 'user', isApproved: !isFarmer });
    
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, role: user.role, isApproved: user.isApproved } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, role: user.role, isApproved: user.isApproved } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
