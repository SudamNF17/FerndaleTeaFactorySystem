const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes");
const employeeRoutes = require("./Routes/EmployeeRoutes");
const attendanceRoutes = require("./Routes/AttendanceRoutes");
const departmentRoutes = require("./Routes/departmentRoutes");
const addProductRoutes = require("./Routes/addproductRoute");
const rawMaterialRoutes = require("./Routes/addRawMaterialRoutes");
const teaLeavesRoutes = require("./Routes/addFreshTeaLeavesRoutes");
const freshRoutes = require("./Routes/fresh");
const rawRoutes = require("./Routes/raw");
const processRoutes = require("./Routes/Process");
const scheduleRoutes = require("./Routes/deliveryScheduleRoutes");
const orderRoutes = require("./Routes/OrderRoutes");

const app = express();

// ================= Middleware =================
app.use(cors({ origin: "http://localhost:3000" })); // allow frontend
app.use(express.json({ limit: "12mb" })); // support large payloads
app.use(express.urlencoded({ limit: "12mb", extended: true }));
app.use(morgan("dev")); // logs requests

// ================= MongoDB Connection =================
const mongoURI = "mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= Routes =================
app.use("/api/users", userRoutes);
app.use("/api/delivery-vans", deliveryVanRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/products", addProductRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/tea-leaves", teaLeavesRoutes);
app.use("/api/fresh-suppliers", freshRoutes);
app.use("/api/raw-suppliers", rawRoutes);
app.use("/api/processes", processRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/schedules", scheduleRoutes);

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ================= Root Route =================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ================= 404 Handler =================
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// ================= Global Error Handler =================
app.use((err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ================= Start Server =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
