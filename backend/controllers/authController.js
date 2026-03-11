const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password,
      otp: generatedOtp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000)
    });

    await user.save();
    console.log(`Success: OTP for ${email} is: ${generatedOtp}`);

    res.status(201).json({
      message: "User registered successfully. OTP sent!",
      user: { email: user.email, otp: user.otp }
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp || new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.updateOne(
      { _id: user._id },
      { $set: { isVerified: true }, $unset: { otp: 1, otpExpires: 1 } }
    );

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(400).json({ message: "Email not verified" });

    const token = generateToken(user);
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};