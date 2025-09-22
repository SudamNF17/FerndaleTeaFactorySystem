const RawSupplier = require("../Model/RawSupplier");

// Get all suppliers
exports.getAllRawSuppliers = async (req, res) => {
  try {
    const suppliers = await RawSupplier.find();
    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Add new supplier
exports.addRawSupplier = async (req, res) => {
  try {
    const newSupplier = new RawSupplier(req.body);
    await newSupplier.save();
    res.status(201).json({
      success: true,
      message: "Raw material supplier added successfully",
      data: newSupplier,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update supplier
exports.updateRawSupplier = async (req, res) => {
  try {
    const updatedSupplier = await RawSupplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier)
      return res.status(404).json({ success: false, error: "Supplier not found" });

    res.status(200).json({
      success: true,
      message: "Raw material supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete supplier
exports.deleteRawSupplier = async (req, res) => {
  try {
    const deletedSupplier = await RawSupplier.findByIdAndDelete(req.params.id);

    if (!deletedSupplier)
      return res.status(404).json({ success: false, error: "Supplier not found" });

    res.status(200).json({
      success: true,
      message: "Raw material supplier deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
