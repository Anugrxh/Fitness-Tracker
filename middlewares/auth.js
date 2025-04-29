const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  // Get the token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If token is missing
  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing' });
  }

  try {
    // Verify token with the secret and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the userId to the request object
    req.userId = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Catch error if token is invalid or expired
    console.error('Token verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
