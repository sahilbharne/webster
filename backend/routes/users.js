import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Sync user data from Clerk to MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { 
      clerkUserId, 
      email, 
      username, 
      firstName, 
      lastName, 
      profileImage,
      lastSignInAt,
      externalAccounts 
    } = req.body;

    if (!clerkUserId || !email) {
      return res.status(400).json({ error: 'clerkUserId and email are required' });
    }

    // Use the static method from User model
    const user = await User.findOrCreateFromClerk({
      id: clerkUserId,
      primaryEmailAddress: { emailAddress: email },
      username: username,
      firstName: firstName,
      lastName: lastName,
      profileImageUrl: profileImage,
      lastSignInAt: lastSignInAt,
      externalAccounts: externalAccounts
    });

    res.status(200).json({ 
      message: 'User synced successfully', 
      user: user.toPublicJSON ? user.toPublicJSON() : user 
    });
  } catch (error) {
    console.error('User sync error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        error: `${field} already exists` 
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by Clerk ID
router.get('/clerk/:clerkUserId', async (req, res) => {
  try {
    const user = await User.findByClerkId(req.params.clerkUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user.toPublicJSON ? user.toPublicJSON() : user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Add this route to your users.js (after the GET /clerk/:clerkUserId route)
router.get('/clerk/:clerkUserId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.params.clerkUserId });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // Update user stats before returning
    await user.updateStats();
    
    res.status(200).json(user.toPublicJSON ? user.toPublicJSON() : user);
  } catch (error) {
    console.error('Get user by Clerk ID error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user.toPublicJSON ? user.toPublicJSON() : user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { 
      username, 
      firstName, 
      lastName, 
      bio, 
      website, 
      socialLinks,
      preferences 
    } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
    if (preferences !== undefined) updateData.preferences = preferences;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: updatedUser.toPublicJSON ? updatedUser.toPublicJSON() : updatedUser 
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        error: `${field} already exists` 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role
router.patch('/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'artist', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
      message: 'Role updated successfully', 
      user: user.toPublicJSON ? user.toPublicJSON() : user 
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update stats before returning
    await user.updateStats();

    res.status(200).json({
      stats: user.stats,
      role: user.role,
      joinedDate: user.createdAt
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search users
router.get('/', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Search by username, firstName, lastName, or email
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role && ['user', 'artist', 'admin'].includes(role)) {
      query.role = role;
    }
    
    // Only active users
    query.isActive = true;

    const users = await User.find(query)
      .select('username firstName lastName profileImage role stats createdAt')
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalUsers: total
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate user account
router.patch('/:userId/deactivate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reactivate user account
router.patch('/:userId/reactivate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User account reactivated successfully' });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;