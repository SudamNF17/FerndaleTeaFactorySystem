// Controllers/deliveryScheduleController.js
const DeliverySchedule = require('../Model/deliveryScheduleModel');

// Helper: check overlap for same van
const hasOverlap = async (van_number, start, end, excludeId = null) => {
  const query = {
    van_number,
    status: { $nin: ['Canceled', 'Pending'] },
    start_time: { $lt: end },
    end_time: { $gt: start },
  };
  if (excludeId) query._id = { $ne: excludeId };
  const found = await DeliverySchedule.findOne(query).lean();
  return !!found;
};

// Generate unique Order ID: DEL-YYYY-XXX
const generateOrderID = async () => {
  const year = new Date().getFullYear();
  const last = await DeliverySchedule.findOne({ order_id: new RegExp(`^DEL-${year}-`) })
    .sort({ createdAt: -1 })
    .lean();
  let next = 1;
  if (last && last.order_id) {
    const parts = last.order_id.split('-');
    next = parseInt(parts[2], 10) + 1;
  }
  return `DEL-${year}-${String(next).padStart(3, '0')}`;
};

// CREATE
exports.createSchedule = async (req, res) => {
  try {
    const {
      schedule_id, wholesaler_name, quantity, van_number, driver_name,
      pickup_location, dropoff_location, expected_date,
      start_time, end_time, status, notes
    } = req.body;

    const start = start_time ? new Date(start_time) : null;
    const end = end_time ? new Date(end_time) : null;
    const expDate = expected_date ? new Date(expected_date) : null;

    // Fix ReferenceError
    if (!req.body.order_id) req.body.order_id = await generateOrderID();

    if ((start && end) && end <= start) {
      return res.status(400).json({ message: 'Invalid start/end time' });
    }

    if (start && end && await hasOverlap(van_number, start, end)) {
      return res.status(409).json({ message: 'Time conflict: this van is already booked' });
    }
    const generateScheduleID = async () => {
  const last = await DeliverySchedule.findOne().sort({ createdAt: -1 }).lean();
  return last?.schedule_id ? last.schedule_id + 1 : 1;
};
    // In createSchedule controller
const schedule = await DeliverySchedule.create({
  order_id: req.body.order_id,        // manual
  schedule_id: await generateScheduleID(), // auto
  wholesaler_name: req.body.wholesaler_name,
  wholesaler_phone: req.body.wholesaler_phone,
  quantity: req.body.quantity,
  van_number: req.body.van_number,
  driver_name: req.body.driver_name,
  pickup_location: req.body.pickup_location,
  dropoff_location: req.body.dropoff_location,
  expected_date: new Date(req.body.expected_date),
  start_time: req.body.start_time ? new Date(req.body.start_time) : null,
  end_time: req.body.end_time ? new Date(req.body.end_time) : null,
  status: req.body.status || 'Pending',
  history: [{ status: req.body.status || 'Pending' }],
  notes: req.body.notes
});

    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending','Scheduled','Dispatched','In Transit','Completed','Canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const schedule = await DeliverySchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    schedule.status = status;
    schedule.history.push({ status });
    await schedule.save();

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Status update failed', error: err.message });
  }
};

// GET ALL
exports.getAll = async (_req, res) => {
  try {
    const schedules = await DeliverySchedule.find().sort({ createdAt: -1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// GET ONE
exports.getOne = async (req, res) => {
  try {
    const schedule = await DeliverySchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// UPDATE
exports.updateSchedule = async (req, res) => {
  try {
    const {
      van_number, driver_name, pickup_location, dropoff_location,
      start_time, end_time, status, notes, wholesaler_name, wholesaler_phone, quantity, expected_date
    } = req.body;

    const schedule = await DeliverySchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const start = start_time ? new Date(start_time) : schedule.start_time;
    const end = end_time ? new Date(end_time) : schedule.end_time;

    if (end && start && end <= start) return res.status(400).json({ message: 'Invalid start/end time' });

    if (van_number || start_time || end_time) {
      const van = van_number || schedule.van_number;
      if (await hasOverlap(van, start, end, req.params.id)) {
        return res.status(409).json({ message: 'Time conflict: this van is already booked' });
      }
    }

    schedule.van_number = van_number || schedule.van_number;
    schedule.driver_name = driver_name || schedule.driver_name;
    schedule.pickup_location = pickup_location || schedule.pickup_location;
    schedule.dropoff_location = dropoff_location || schedule.dropoff_location;
    schedule.start_time = start;
    schedule.end_time = end;
    schedule.status = status || schedule.status;
    schedule.notes = notes || schedule.notes;
    schedule.wholesaler_name = wholesaler_name || schedule.wholesaler_name;
    schedule.wholesaler_phone = req.body.wholesaler_phone || schedule.wholesaler_phone; 
    schedule.quantity = quantity || schedule.quantity;
    schedule.expected_date = expected_date ? new Date(expected_date) : schedule.expected_date;

    schedule.history.push({ status: schedule.status });

    await schedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await DeliverySchedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Deleted successfully', id: schedule._id });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
