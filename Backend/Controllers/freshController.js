const FreshSupplier = require("../Model/FreshSupplier");

// @desc    Get all fresh suppliers
// @route   GET /api/fresh-suppliers
// @access  Public
exports.getAllFreshSuppliers = async (req, res) => {
  try {
    const suppliers = await FreshSupplier.find();
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

// @desc    Add a new fresh supplier
// @route   POST /api/fresh-suppliers
// @access  Public
exports.addFreshSupplier = async (req, res) => {
  try {
    const newSupplier = new FreshSupplier(req.body);
    await newSupplier.save();
    res.status(201).json({
      success: true,
      message: "Fresh supplier added successfully",
      data: newSupplier,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update a fresh supplier by ID
// @route   PUT /api/fresh-suppliers/:id
// @access  Public
exports.updateFreshSupplier = async (req, res) => {
  try {
    const updatedSupplier = await FreshSupplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fresh supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete a fresh supplier by ID
// @route   DELETE /api/fresh-suppliers/:id
// @access  Public
exports.deleteFreshSupplier = async (req, res) => {
  try {
    const deletedSupplier = await FreshSupplier.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fresh supplier deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
