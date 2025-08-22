// Model/deliveryScheduleModel.js
const mongoose = require('mongoose');

const DeliveryScheduleSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true }, // auto-generated
  schedule_id: { type: Number, required: true, unique: true },
  wholesaler_name: { type: String, required: true, trim: true, maxlength: 100 },
  quantity: { type: Number, required: true },
  van_number: { type: String, required: true, trim: true },
  driver_name: { type: String, required: true, trim: true, maxlength: 100 },
  pickup_location: { type: String, required: true, trim: true },
  dropoff_location: { type: String, required: true, trim: true },
  expected_date: { type: Date, required: true },
  start_time: { type: Date }, // can be empty until scheduled
  end_time: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Dispatched', 'In Transit', 'Completed', 'Canceled'],
    default: 'Pending'
  },
  history: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
    }
  ],
  notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('DeliverySchedule', DeliveryScheduleSchema);
