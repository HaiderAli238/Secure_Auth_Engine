const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const protectedRoutes = require("./routes/protectedRoute");

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:5173"], 
  credentials: true 
}));
app.use(express.json());

// Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/protected", protectedRoutes);

app.get("/", (req, res) => {
  res.send("Secure Auth Engine is Running...");
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("DB Connection Error:", err.message));