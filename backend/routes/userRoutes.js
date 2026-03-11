const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/all-users", protect, adminOnly, getAllUsers);
router.delete("/delete/:id", protect, adminOnly, deleteUser);

module.exports = router;