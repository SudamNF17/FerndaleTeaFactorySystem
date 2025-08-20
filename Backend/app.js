const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import your routes
const orderRoutes = require("./Routes/OrderRoutes");
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes")

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json


// MongoDB Connection (Cloud Mongo URI or Localhost)
mongoose.connect("mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes); // All user/login/register routes
app.use("/api/delivery-vans", deliveryVanRoutes)
app.use("/api/orders", orderRoutes);

// Root route for testing in Postman
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Root route for testing in Postman
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Root route for testing in Postman
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
