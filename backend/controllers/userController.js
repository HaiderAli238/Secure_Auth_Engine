const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    // req.user._id wo ID hai jo authMiddleware ne token verify karke nikaali thi
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Only if you want to allow changing password from profile

    await user.save();
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};