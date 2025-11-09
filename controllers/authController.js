import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Register User
export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = new User({ ...req.body });
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password (assuming comparePassword method is defined in the User model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate a JWT token with an expiration time
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET, // Use an environment variable for the JWT secret
      { expiresIn: '10h' }
    );

    // Send the token back to the client
    res.status(200).json({ success: true, message: 'Login successful', token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
      