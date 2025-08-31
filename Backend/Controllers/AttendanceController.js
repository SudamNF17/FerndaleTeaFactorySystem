const Attendance = require("../Model/AttendanceModel");

// Get all attendance records
exports.getAttendanceRecords = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single attendance record
exports.getAttendanceById = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add attendance record
exports.addAttendanceRecord = async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update attendance record
exports.updateAttendanceRecord = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete attendance record
exports.deleteAttendanceRecord = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
