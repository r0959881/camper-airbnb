const jwt = require('jsonwebtoken');

// Middleware to authenticate the user and optionally check their role
const auth = (requiredRole = null) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      req.userId = decoded.userId; // Attach userId to the request object
      req.role = decoded.role; // Attach role to the request object

      // If a role is required, check if the user's role matches
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;