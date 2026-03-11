const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const { registerValidator, loginValidator } = require("../middleware/validators");

router.post("/register", registerValidator, authController.register);

router.post("/verify-otp", authController.verifyOTP);

router.post("/login", loginValidator, authController.login);

module.exports = router;