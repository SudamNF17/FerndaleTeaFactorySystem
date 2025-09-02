const express = require("express");
const router = express.Router();
const FreshSupplier = require("../Model/FreshSupplier");

// Get all fresh suppliers
router.get("/", async (req, res) => {
  const suppliers = await FreshSupplier.find();
  res.json(suppliers);
});

// Add new supplier
router.post("/", async (req, res) => {
  const newSupplier = new FreshSupplier(req.body);
  await newSupplier.save();
  res.json({ message: "Fresh supplier added", supplier: newSupplier });
});

// Update supplier
router.put("/:id", async (req, res) => {
  const updatedSupplier = await FreshSupplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Fresh supplier updated", supplier: updatedSupplier });
});

// Delete supplier
router.delete("/:id", async (req, res) => {
  await FreshSupplier.findByIdAndDelete(req.params.id);
  res.json({ message: "Fresh supplier deleted" });
});

module.exports = router;
