const RawSupplier = require("../Model/RawSupplier");

// Get all
exports.getAllRawSuppliers = async (req, res) => {
  const suppliers = await RawSupplier.find();
  res.json(suppliers);
};

// Add new
exports.addRawSupplier = async (req, res) => {
  const newSupplier = new RawSupplier(req.body);
  await newSupplier.save();
  res.json({ message: "Raw supplier added", supplier: newSupplier });
};

// Update
exports.updateRawSupplier = async (req, res) => {
  const updatedSupplier = await RawSupplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Raw supplier updated", supplier: updatedSupplier });
};

// Delete
exports.deleteRawSupplier = async (req, res) => {
  await RawSupplier.findByIdAndDelete(req.params.id);
  res.json({ message: "Raw supplier deleted" });
};
