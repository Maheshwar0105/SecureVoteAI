const User = require('../models/User');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;

    await user.save();
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isWalletBound: user.isWalletBound,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get All Users (Admin/Officer only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    if (!role || !['voter', 'officer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Please provide a valid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user: { id: user._id, role: user.role } });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete user (Admin only - soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
