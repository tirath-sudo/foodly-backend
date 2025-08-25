import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: hashed });

    const token = signToken(user._id);
    return res.json({ success: true, token });
  } catch (err) {
    console.error("Register error:", err);
    return res.json({ success: false, message: "Server error" });
  }
};

// POST /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id);
    return res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.json({ success: false, message: "Server error" });
  }
};
