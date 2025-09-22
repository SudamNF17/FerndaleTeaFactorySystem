const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  faceToken: { type: String, required: true },
  logs: [
    {
      status: { type: String, default: "Present" },
      date: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model("Attendance", attendanceSchema);
