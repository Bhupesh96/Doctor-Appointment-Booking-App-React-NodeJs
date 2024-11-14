import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update",
    });
  }
};
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      success: true,
      message: "User found.",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "No user found",
    });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: "Users found.",
      data: users,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;  // Ensure password is omitted properly
    res.status(200).json({
      success: true,
      message: "Profile info retrieved",
      data: rest,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);  // Log detailed error
    res.status(500).json({
      success: false,
      message: "Server error: Failed to get profile",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    //step - 1: retrive appointemnets from booking

    const bookings = await Booking.find({ user: req.userId });

    //step - 2: extract doctor ids from appointment booking
    const doctorIds = bookings.map((el) => el.doctor.id);
    //step - 2: retrives doctors using doctor ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Appointments are getting",
        data: doctors,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, connot get" });
  }
};
