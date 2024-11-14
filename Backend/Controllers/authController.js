import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;
  try {
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let user = null;
    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    // Check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (error) {
    console.error("Registration error:", error); // Add console log for debugging
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body; // Ensure you extract both email and password
  try {
    // Debugging: Log incoming request
    console.log("Login attempt for email:", email);

    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    // Combine user checking for patients and doctors
    user = patient || doctor;

    // Check if user exists
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found." });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log("Invalid credentials");
      return res.status(404).json({ status: false, message: "Invalid credentials" });
    }

    // Get token
    const token = generateToken(user);
    const { password: _, role, appointments, ...rest } = user._doc; // Exclude password

    res.status(202).json({
      status: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    console.error("Login error:", error); // Log error in server for debugging
    return res.status(500).json({ status: false, message: "Failed to login." });
  }
};

