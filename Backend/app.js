const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const userRoutes = require("./Routes/UserRoutes");
const deliveryVanRoutes = require("./Routes/DeliveryVanRoutes");
const employeeRoutes = require("./Routes/EmployeeRoutes");
const attendanceRoutes = require("./Routes/AttendanceRoutes");

const app = express();

// ================= Middleware =================
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // logs requests

// ================= MongoDB Connection =================
mongoose.connect(
  "mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/teafactory",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= Routes =================
app.use("/api/users", userRoutes);
app.use("/api/delivery-vans", deliveryVanRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);

// ================= Test Root Route =================
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
