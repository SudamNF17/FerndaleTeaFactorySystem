const mongoose = require("mongoose");

const addRawMaterialSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  materialType: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  pricePerUnit: { type: Number, default: 0 },
  certification: { type: String },
  factoryLocation: { type: String, required: true },
  collectedLocationName: { type: String, required: true },
  collectedLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("AddRawMaterial", addRawMaterialSchema);
