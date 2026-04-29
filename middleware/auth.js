const jwt = require('jsonwebtoken');
const localStore = require('../localStore');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Support for fast direct login mock tokens
      if (token.startsWith('mock-token-')) {
        // Fast fallback logic based on the user's role/id stored in token or just rely on a default user.
        // But since we can't easily extract ID from mock token, let's just find the first user
        // wait, we can encode the email in the mock token: mock-token-email@organic.com
        const email = token.split('mock-token-')[1];
        if (email) {
            req.user = await localStore.findUserByEmail(email);
            if (req.user) {
                return next();
            }
        }
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await localStore.findUserById(decoded.id);
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this route' });
    }
    next();
  };
};

module.exports = { protect, authorize };
