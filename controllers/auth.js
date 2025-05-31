const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({ email, name, password });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User registration failed",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        token: token,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === "production", 
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { register, login };
