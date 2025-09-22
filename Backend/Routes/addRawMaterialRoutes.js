const express = require("express");
const router = express.Router();
const rawMaterialController = require("../Controllers/addRawMaterialController");

// Get all raw materials
router.get("/", rawMaterialController.getAllRawMaterials);

// Create a new raw material
router.post("/", rawMaterialController.createRawMaterial);

// Update an existing raw material
router.put("/:id", rawMaterialController.updateRawMaterial);

// Delete a raw material
router.delete("/:id", rawMaterialController.deleteRawMaterial);

module.exports = router;
