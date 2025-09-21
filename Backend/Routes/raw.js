const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Supplier schema
const rawSupplierSchema = new mongoose.Schema({
  supplierName: String,
  contactPerson: String,
  phone: String,
  email: String,
  company: String,
  materialType: String,
  quantity: Number,
  pricePerUnit: Number,
  leadTime: String,
  certification: String,
  latitude: Number,
  longitude: Number,
  locationName: String,
}, { timestamps: true });

const RawSupplier = mongoose.model("RawSupplier", rawSupplierSchema);

// GET all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await RawSupplier.find();
    res.json({ suppliers }); // ✅ frontend expects { suppliers: [...] }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new supplier
router.post("/", async (req, res) => {
  try {
    const newSupplier = new RawSupplier(req.body);
    const saved = await newSupplier.save();
    res.json({ supplier: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save supplier" });
  }
});

// PUT update supplier by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await RawSupplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ supplier: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update supplier" });
  }
});

// DELETE supplier by ID
router.delete("/:id", async (req, res) => {
  try {
    await RawSupplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
});

module.exports = router;
