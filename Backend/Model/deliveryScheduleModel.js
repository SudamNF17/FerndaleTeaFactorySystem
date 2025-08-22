// Model/deliveryScheduleModel.js
const mongoose = require('mongoose');

const DeliveryScheduleSchema = new mongoose.Schema({
  schedule_id: { type: Number, required: true, unique: true },
  van_number: { type: String, required: true, trim: true },
  driver_name: { type: String, required: true, trim: true, maxlength: 100 },
  pickup_location: { type: String, required: true, trim: true },
  dropoff_location: { type: String, required: true, trim: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Canceled'],
    default: 'Scheduled'
  },
  notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('DeliverySchedule', DeliveryScheduleSchema);
