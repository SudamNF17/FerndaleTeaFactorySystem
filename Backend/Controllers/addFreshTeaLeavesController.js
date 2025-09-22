const AddFreshTeaLeaves = require("../Model/addFreshTeaLeavesModel");

// Get all leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await AddFreshTeaLeaves.find();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create leaves
exports.createLeaves = async (req, res) => {
  try {
    const { supplierName, email, weight, pricePerKg } = req.body;
    const totalPrice = weight * pricePerKg;

    const leaves = new AddFreshTeaLeaves({ supplierName, email, weight, pricePerKg, totalPrice });
    const saved = await leaves.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update leaves
exports.updateLeaves = async (req, res) => {
  try {
    const { supplierName, email, weight, pricePerKg } = req.body;
    const totalPrice = weight * pricePerKg;

    const updated = await AddFreshTeaLeaves.findByIdAndUpdate(
      req.params.id,
      { supplierName, email, weight, pricePerKg, totalPrice },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Tea leaves not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete leaves
exports.deleteLeaves = async (req, res) => {
  try {
    const deleted = await AddFreshTeaLeaves.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tea leaves not found" });
    res.json({ message: "Tea leaves deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
