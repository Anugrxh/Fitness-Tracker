// controllers/authController.js
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register user

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ email, password });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Login user

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({
        message: 'Login successful',
        token: token,
        userId: user._id
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Edit user profile
exports.editProfile = async (req, res) => {
    try {
      const { userId } = req.params; // Extract userId from the URL
      const { email, password, profile } = req.body;
  
      // Ensure the logged-in user can only update their own profile
      if (req.userId !== userId) {
        return res.status(403).json({ error: 'You are not authorized to update this profile' });
      }
  
      // Find user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user email if provided (optional)
      if (email) user.email = email;
  
      // Update user password if provided (it should be hashed before saving)
      if (password) {
        user.password = password; // Let pre-save hook hash it
      }
      
      // Update profile data
      if (profile) {
        if (profile.age) user.profile.age = profile.age;
        if (profile.weight) user.profile.weight = profile.weight;
        if (profile.height) user.profile.height = profile.height;
        if (profile.fitnessLevel) user.profile.fitnessLevel = profile.fitnessLevel;
      }
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  // Logout user
exports.logout = async (req, res) => {
    try {
      // For stateless JWT, logout is typically handled on the client by deleting the token.
      // But you can optionally blacklist the token or simply instruct client to remove it.
  
      res.status(200).json({ message: 'Logout successful. Please remove the token on the client side.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  