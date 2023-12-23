import User from "../models/EmbedApproach.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    let tasks = [];

    // Email Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password Validation
    if (password.length < 8 || password.length > 12) {
      return res
        .status(400)
        .json({ message: "Password must be exactly in between 8 to 12 characters." });
    }
    const user = new User({ email, password, userName, tasks });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName : userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const validPassword = password === user.password;
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userName: userName }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};