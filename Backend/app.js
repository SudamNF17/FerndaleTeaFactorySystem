const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import your routes
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes");
const addProductRoutes = require("./Routes/addproductRoute");
const rawMaterialRoutes = require("./Routes/addRawMaterialRoutes");
const teaLeavesRoutes = require("./Routes/addFreshTeaLeavesRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/delivery-vans", deliveryVanRoutes);
app.use("/api/products", addProductRoutes);
app.use("/api/raw-materials", rawMaterialRoutes); // Updated raw material routes
app.use("/api/tea-leaves", teaLeavesRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
