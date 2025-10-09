const mongoose = require("mongoose");

const addFreshTeaLeavesSchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: true },
    email: { type: String, required: true }, // ✅ Added email field
    weight: { type: Number, required: true }, // kg
    pricePerKg: { type: Number, required: true },
    totalPrice: { type: Number },
    receivedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddFreshTeaLeaves", addFreshTeaLeavesSchema);
