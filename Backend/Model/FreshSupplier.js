const mongoose = require("mongoose");

const freshSupplierSchema = new mongoose.Schema({
  supplierName: String,
  contactPerson: String,
  phone: String,
  email: String,
  farmLocation: String,
  teaType: String,
  organicCertified: Boolean,
  harvestSeason: String,
  pricePerKg: Number,
  latitude: Number,
  longitude: Number,
  locationName: String,
});

module.exports = mongoose.model("FreshSupplier", freshSupplierSchema);
