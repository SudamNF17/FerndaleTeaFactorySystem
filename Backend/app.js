const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes");

const freshRoutes = require("./Routes/fresh"); // Fresh supplier routes
const rawRoutes = require("./Routes/raw"); // Raw supplier routes
const processRoutes = require("./Routes/Process"); // Process routes

const scheduleRoutes = require("./Routes/deliveryScheduleRoutes");
const freshRoutes = require("./Routes/fresh");
const rawRoutes = require("./Routes/raw");
const orderRoutes = require("./Routes/OrderRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend requests
app.use(express.json()); // Parse JSON requests

// MongoDB Connection
const mongoURI =
  "mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);            // All user/login/register routes
app.use("/api/delivery-vans", deliveryVanRoutes);
app.use("/api/fresh-suppliers", freshRoutes); // Fresh supplier CRUD
app.use("/api/raw-suppliers", rawRoutes); // Raw supplier CRUD
app.use("/api/processes", processRoutes); // ✅ FIXED: plural & consistent with frontend

app.use("/api/orders", orderRoutes);
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
