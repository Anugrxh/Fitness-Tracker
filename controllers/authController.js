// controllers/authController.js
const nodemailer = require('nodemailer');
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
        { expiresIn: '1d' }
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
  
  

// FORGOT PASSWORD CONTROLLER
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({ message: 'If an account exists, a password reset link has been sent.' });
    }

    // Create reset token with 1-day expiry
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Construct reset link
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Verify environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration in environment variables');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Send email with reset link using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 day.</p>
             <p>If you didn't request this, please ignore this email.</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to: ${email}`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    // Store the resetToken in the user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day
    await user.save();

    res.status(200).json({ message: 'If an account exists, a password reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// RESET PASSWORD CONTROLLER
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify token -  Now, verify against the token stored in the user document
    const user = await User.findOne({ 
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() } // Check expiry
    });
    
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });


    // Update password
    user.password = newPassword; // Let pre-save hook hash it
    user.resetToken = undefined; // Clear the token
    user.resetTokenExpiry = undefined; // Clear the expiry
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
