// routes/deliveryVanRoutes.js
const express = require('express');
const router = express.Router();
const deliveryVanController = require('../Controllers/DeliveryVanControll');

// CREATE a new delivery van
router.post('/', deliveryVanController.createVan);

// READ all delivery vans
router.get('/', deliveryVanController.getAllVans);

// READ a single delivery van by ID
router.get('/:id', deliveryVanController.getVanById);

// UPDATE a delivery van by ID
router.put('/:id', deliveryVanController.updateVan);

// DELETE a delivery van by ID
router.delete('/:id', deliveryVanController.deleteVan);

module.exports = router;
