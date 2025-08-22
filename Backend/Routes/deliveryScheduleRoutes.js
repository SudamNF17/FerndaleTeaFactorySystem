// Routes/deliveryScheduleRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../Controllers/deliveryScheduleController');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.createSchedule);
router.put('/:id', ctrl.updateSchedule);
router.delete('/:id', ctrl.deleteSchedule);

// quick status update
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
