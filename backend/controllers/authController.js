const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail"); // Path sahi check kar lein

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: "User already exists" });

    // 2. Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Create User Instance
    const newUser = new User({
      name,
      email,
      password,
      otp: generatedOtp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 mins expiry
    });

    // 4. Send Email using your utility
    try {
      await sendEmail({
        email: newUser.email,
        subject: "Verify your IronPulse Account",
        message: `Hello ${name},\n\nYour verification code is: ${generatedOtp}\n\nThis code will expire in 10 minutes.`
      });

      // Email chali jaye tabhi save karein
      await newUser.save();
      
      res.status(201).json({
        success: true,
        message: "Registration successful! Please check your email for OTP.",
        user: { email: newUser.email } 
      });

    } catch (emailErr) {
      console.error("Nodemailer Error:", emailErr.message);
      return res.status(500).json({ success: false, message: "Could not send verification email." });
    }

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Account verified successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const token = generateToken(user);
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// --- Naya logic yahan se shuru hota hai ---

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = resetOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Code",
        message: `Your password reset code is: ${resetOtp}. It will expire in 10 minutes.`
      });
      res.json({ success: true, message: "Reset code sent to your email!" });
    } catch (err) {
      return res.status(500).json({ message: "Error sending email" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = newPassword; // Pre-save hook will hash this automatically
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};