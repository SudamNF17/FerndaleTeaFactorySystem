const AddRawMaterial = require("../Model/addRawMaterialModel");

// Get all raw materials
exports.getAllRawMaterials = async (req, res) => {
  try {
    const raws = await AddRawMaterial.find();
    res.json(raws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create raw material
exports.createRawMaterial = async (req, res) => {
  try {
    const raw = new AddRawMaterial({
      supplierName: req.body.supplierName,
      mobile: req.body.mobile,
      email: req.body.email,
      materialType: req.body.materialType,
      quantity: req.body.quantity,
      pricePerUnit: req.body.pricePerUnit,
      certification: req.body.certification,
      factoryLocation: req.body.factoryLocation,
      collectedLocationName: req.body.collectedLocationName,
      collectedLocation: {
        lat: req.body.collectedLocation.lat,
        lng: req.body.collectedLocation.lng
      }
    });

    const saved = await raw.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update raw material
exports.updateRawMaterial = async (req, res) => {
  try {
    const updated = await AddRawMaterial.findByIdAndUpdate(
      req.params.id,
      {
        supplierName: req.body.supplierName,
        mobile: req.body.mobile,
        email: req.body.email,
        materialType: req.body.materialType,
        quantity: req.body.quantity,
        pricePerUnit: req.body.pricePerUnit,
        certification: req.body.certification,
        factoryLocation: req.body.factoryLocation,
        collectedLocationName: req.body.collectedLocationName,
        collectedLocation: {
          lat: req.body.collectedLocation.lat,
          lng: req.body.collectedLocation.lng
        }
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Raw material not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete raw material
exports.deleteRawMaterial = async (req, res) => {
  try {
    const deleted = await AddRawMaterial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Raw material not found" });
    res.json({ message: "Raw material deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
