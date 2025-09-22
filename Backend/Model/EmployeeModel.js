// Model/EmployeeModel.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  contact: { type: String },
  address: { type: String },
  department: { type: String },
  type: { type: String, enum: ["Permanent", "Temporary"] },
  jobRole: { type: String },
  description: { type: String },
  active: { type: Boolean, default: true },

  // Face++ data
  faceToken: { type: String, default: null },      // face_token from Face++
  faceRegistered: { type: Boolean, default: false } // whether added to FaceSet
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
