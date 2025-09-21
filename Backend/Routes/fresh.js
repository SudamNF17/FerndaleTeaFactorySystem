const express = require("express");
const router = express.Router();
const FreshSupplier = require("../Model/FreshSupplier"); // Make sure path is correct

// GET all fresh suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await FreshSupplier.find().sort({ createdAt: -1 }); // Latest first
    res.json({ suppliers });
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new supplier
router.post("/", async (req, res) => {
  try {
    const supplier = new FreshSupplier(req.body);
    await supplier.save();
    res.status(201).json({ supplier });
  } catch (err) {
    console.error("Error creating supplier:", err);
    res.status(400).json({ message: "Failed to create supplier", error: err.message });
  }
});

// PUT /:id update supplier
router.put("/:id", async (req, res) => {
  try {
    const supplier = await FreshSupplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensure validators run on update
    );
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ supplier });
  } catch (err) {
    console.error("Error updating supplier:", err);
    res.status(400).json({ message: "Failed to update supplier", error: err.message });
  }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  try {
    const supplier = await FreshSupplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(400).json({ message: "Failed to delete supplier", error: err.message });
  }
});

module.exports = router;
