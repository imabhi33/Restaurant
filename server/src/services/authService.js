const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { validateUser, validateEmail, validatePhone } = require('../validators/validators');

class AuthService {
  async register(userData) {
    // Validate input
    const validation = validateUser(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = new User({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: 'user',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const allowedFields = ['name', 'phone', 'address', 'city', 'state', 'pincode', 'profileImage'];
    const updateObject = {};

    allowedFields.forEach(field => {
      if (updateData[field]) {
        updateObject[field] = updateData[field];
      }
    });

    const user = await User.findByIdAndUpdate(userId, updateObject, {
      new: true,
      runValidators: true,
    }).select('-password');

    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { success: true, message: 'Password updated successfully' };
  }
}

module.exports = new AuthService();
