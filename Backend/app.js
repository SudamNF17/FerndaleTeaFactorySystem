const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes");
const freshRoutes = require("./Routes/fresh"); // Fresh supplier routes
const rawRoutes = require("./Routes/raw"); // Raw supplier routes
const processRoutes = require("./Routes/Process"); // Process routes

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend requests
app.use(express.json()); // Parse JSON requests

// MongoDB Connection
const mongoURI =
  "mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/delivery-vans", deliveryVanRoutes);
app.use("/api/fresh-suppliers", freshRoutes); // Fresh supplier CRUD
app.use("/api/raw-suppliers", rawRoutes); // Raw supplier CRUD
app.use("/api/processes", processRoutes); // ✅ FIXED: plural & consistent with frontend

// Root route for testing
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
