const express = require('express');
const router = express.Router();
const ctrl = require('../Controllers/deliveryScheduleController');

router.get('/', ctrl.getAll);                 // ✅ must be function
router.get('/:id', ctrl.getOne);              // ✅ must be function
router.post('/', ctrl.createSchedule);        // ✅ must be function
router.put('/:id', ctrl.updateSchedule);      // ✅ must be function
router.delete('/:id', ctrl.deleteSchedule);   // ✅ must be function
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
