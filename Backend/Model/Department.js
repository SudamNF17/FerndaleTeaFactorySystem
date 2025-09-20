const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employees: { type: Number, default: 0 },
  performanceThisMonth: { type: Number, default: 50 },
  performanceLastMonth: { type: Number, default: 30 },
});

module.exports = mongoose.model("Department", departmentSchema);
