import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // Look for clerkUserId in several common places.
    let clerkUserId = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // For local/dev convenience some clients may send "Bearer <clerkUserId>"
      clerkUserId = authHeader.split(' ')[1];
    }

    clerkUserId = clerkUserId
      || req.headers['x-clerk-user-id']
      || (req.body && req.body.clerkUserId)
      || (req.query && req.query.clerkUserId)
      || (req.cookies && req.cookies.clerkUserId);

    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authorized: clerkUserId missing' });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(401).json({ message: 'Not authorized: user not found' });
    }

    // Attach full user document (or minimal info) to request for downstream use
    req.user = user;
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error in auth middleware' });
  }
};
