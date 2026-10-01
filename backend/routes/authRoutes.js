const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// =========================
// SIGNUP
// =========================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email,
  password: hashedPassword,
});

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
   const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);

if (!isPasswordCorrect) {
  return res.status(401).json({
    success: false,
    message: "Invalid password",
  });
}
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Login successful
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =========================
// EXPORT ROUTER
// =========================
module.exports = router;