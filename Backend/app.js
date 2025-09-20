const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes");
const scheduleRoutes = require("./Routes/deliveryScheduleRoutes");
const freshRoutes = require("./Routes/fresh");
const rawRoutes = require("./Routes/raw");





const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON requests

// MongoDB Connection
const mongoURI = "mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes); // All user/login/register routes
app.use("/api/delivery-vans", deliveryVanRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/fresh", freshRoutes);
app.use("/api/raw", rawRoutes);







// Root route for testing
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
