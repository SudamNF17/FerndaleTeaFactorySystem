const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['HRManager', 'Supplier', 'Wholesaler'], required: true },
  status:   { type: String, enum: ['Active', 'Suspended'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
