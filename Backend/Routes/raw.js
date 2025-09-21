const express = require("express");
const router = express.Router();
const RawSupplier = require("../Model/RawSupplier");

// Get all raw suppliers
router.get("/", async (req, res) => {
  const suppliers = await RawSupplier.find();
  res.json(suppliers);
});

// Add new supplier
router.post("/", async (req, res) => {
  const newSupplier = new RawSupplier(req.body);
  await newSupplier.save();
  res.json({ message: "Raw supplier added", supplier: newSupplier });
});

// Update supplier
router.put("/:id", async (req, res) => {
  const updatedSupplier = await RawSupplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Raw supplier updated", supplier: updatedSupplier });
});

// Delete supplier
router.delete("/:id", async (req, res) => {
  await RawSupplier.findByIdAndDelete(req.params.id);
  res.json({ message: "Raw supplier deleted" });
});

module.exports = router;
