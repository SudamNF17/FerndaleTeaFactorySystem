const FreshSupplier = require("../Model/FreshSupplier");

// Get all
exports.getAllFreshSuppliers = async (req, res) => {
  const suppliers = await FreshSupplier.find();
  res.json(suppliers);
};

// Add new
exports.addFreshSupplier = async (req, res) => {
  const newSupplier = new FreshSupplier(req.body);
  await newSupplier.save();
  res.json({ message: "Fresh supplier added", supplier: newSupplier });
};

// Update
exports.updateFreshSupplier = async (req, res) => {
  const updatedSupplier = await FreshSupplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Fresh supplier updated", supplier: updatedSupplier });
};

// Delete
exports.deleteFreshSupplier = async (req, res) => {
  await FreshSupplier.findByIdAndDelete(req.params.id);
  res.json({ message: "Fresh supplier deleted" });
};
