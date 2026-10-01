const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ===============================
// ROUTES
// ===============================

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/OrderRoutes");

// ===============================
// APP
// ===============================

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// ===============================
// HOME / TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FoodieGo Backend API is running 🚀",
  });
});

// ===============================
// PORT
// ===============================

const PORT = process.env.PORT || 5000;

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(
        `FoodieGo Backend running on http://localhost:${PORT} 🚀`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed ❌",
      error.message
    );
  });