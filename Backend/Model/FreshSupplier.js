const mongoose = require("mongoose");

const FreshSupplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true, trim: true },
  contactPerson: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  farmLocation: { type: String, trim: true },
  teaType: { type: String, trim: true },
  organicCertified: { type: Boolean, default: false },
  harvestSeason: { type: String, trim: true },
  pricePerKg: { type: Number, default: 0 },
  latitude: { type: Number },
  longitude: { type: Number },
  locationName: { type: String, trim: true },
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("FreshSupplier", FreshSupplierSchema);
