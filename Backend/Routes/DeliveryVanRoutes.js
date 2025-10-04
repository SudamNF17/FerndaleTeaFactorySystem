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

router.put("/:id/location", deliveryVanController.updateLocation);

// Mobile-friendly endpoints to update location by alternative keys
router.put('/by-van-number/:van_number/location', deliveryVanController.updateLocationByVanNumber);
router.put('/by-driver-id/:driverId/location', deliveryVanController.updateLocationByDriverId);

// Demo van creation endpoint for testing (must be before /:id route)
router.get('/demo', deliveryVanController.createDemoVan);

// Server-Sent Events streams for live tracking
router.get('/:id/stream', deliveryVanController.streamById);
router.get('/by-van-number/:van_number/stream', deliveryVanController.streamByVanNumber);
router.get('/by-driver-id/:driverId/stream', deliveryVanController.streamByDriverId);
module.exports = router;
