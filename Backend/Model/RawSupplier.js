const mongoose = require("mongoose");

const rawSupplierSchema = new mongoose.Schema({
  supplierName: String,
  contactPerson: String,
  phone: String,
  email: String,
  warehouseLocation: String,
  rawMaterialType: String,
  qualityGrade: String,
  quantityKg: Number,
  latitude: Number,
  longitude: Number,
  locationName: String,
});

module.exports = mongoose.model("RawSupplier", rawSupplierSchema);
