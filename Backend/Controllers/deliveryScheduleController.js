// Controllers/deliveryScheduleController.js
const DeliverySchedule = require('../Model/deliveryScheduleModel');

// helper: check overlap for same van
const hasOverlap = async (van_number, start, end, excludeId = null) => {
  const query = {
    van_number,
    status: { $ne: 'Canceled' },
    start_time: { $lt: end },
    end_time: { $gt: start },
  };
  if (excludeId) query._id = { $ne: excludeId };
  const found = await DeliverySchedule.findOne(query).lean();
  return !!found;
};

exports.createSchedule = async (req, res) => {
  try {
    const {
      schedule_id, van_number, driver_name,
      pickup_location, dropoff_location,
      start_time, end_time, status, notes
    } = req.body;

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ message: 'Invalid start/end time' });
    }

    if (await hasOverlap(van_number, start, end)) {
      return res.status(409).json({ message: 'Time conflict: this van is already booked in that time range.' });
    }

    const schedule = await DeliverySchedule.create({
      schedule_id, van_number, driver_name,
      pickup_location, dropoff_location, start_time: start, end_time: end, status, notes
    });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const items = await DeliverySchedule.find({}).sort({ start_time: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await DeliverySchedule.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const {
      van_number, driver_name, pickup_location, dropoff_location,
      start_time, end_time, status, notes, schedule_id
    } = req.body;

    const existing = await DeliverySchedule.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    const start = new Date(start_time ?? existing.start_time);
    const end = new Date(end_time ?? existing.end_time);
    const van = van_number ?? existing.van_number;

    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ message: 'Invalid start/end time' });
    }

    if (await hasOverlap(van, start, end, req.params.id)) {
      return res.status(409).json({ message: 'Time conflict: this van is already booked in that time range.' });
    }

    existing.schedule_id = schedule_id ?? existing.schedule_id;
    existing.van_number = van;
    existing.driver_name = driver_name ?? existing.driver_name;
    existing.pickup_location = pickup_location ?? existing.pickup_location;
    existing.dropoff_location = dropoff_location ?? existing.dropoff_location;
    existing.start_time = start;
    existing.end_time = end;
    existing.status = status ?? existing.status;
    existing.notes = notes ?? existing.notes;

    const saved = await existing.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await DeliverySchedule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', id: deleted._id });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// Quick status change (e.g., to Completed)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Scheduled','In Progress','Completed','Canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await DeliverySchedule.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Status update failed', error: err.message });
  }
};
