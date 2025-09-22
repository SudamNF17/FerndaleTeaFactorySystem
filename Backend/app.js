const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes");
const addProductRoutes = require("./Routes/addproductRoute");
const rawMaterialRoutes = require("./Routes/addRawMaterialRoutes");
const teaLeavesRoutes = require("./Routes/addFreshTeaLeavesRoutes");
const freshRoutes = require("./Routes/fresh"); 
const rawRoutes = require("./Routes/raw"); 
const processRoutes = require("./Routes/Process"); 
const scheduleRoutes = require("./Routes/deliveryScheduleRoutes");
const orderRoutes = require("./Routes/OrderRoutes");

const app = express();

// ✅ Middleware (keep only once)
app.use(cors({ origin: "http://localhost:3000" })); // allow frontend
app.use(express.json());

// ✅ MongoDB Connection (single, not duplicated)
const mongoURI = "mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/users", userRoutes);            
app.use("/api/delivery-vans", deliveryVanRoutes);
app.use("/api/products", addProductRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/tea-leaves", teaLeavesRoutes);
app.use("/api/fresh-suppliers", freshRoutes);
app.use("/api/raw-suppliers", rawRoutes);
app.use("/api/processes", processRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/schedules", scheduleRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
