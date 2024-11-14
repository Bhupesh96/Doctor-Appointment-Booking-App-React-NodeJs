import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error("JWT error:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token is expired',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const { userId, role } = req;
  let user;

  try {
    if (role === "patient") {
      user = await User.findById(userId);
    } else if (role === "doctor") {
      user = await Doctor.findById(userId);
    }

    if (!user || !roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "You're not authorized",
      });
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};
