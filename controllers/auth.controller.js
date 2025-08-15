import AdminUser from "../models/adminUser.model.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../utils/jwt.utils";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const adminUser = await AdminUser.findOne({ email });

  if (adminUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new AdminUser({
      email,
      hashed_password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      generateJWT(newUser._id, res);

      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(400).json({ message: "User creation failed" });
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const adminUser = await AdminUser.findOne({ email });

    if (!adminUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, adminUser.hashed_password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateJWT(adminUser._id, res);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};
