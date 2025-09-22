const mongoose = require("mongoose");

const ProcessSchema = new mongoose.Schema({
  processName: { type: String, required: true },
  date: { type: Date, required: true },
  bopf1: Number,
  bopf2: Number,
  bopf3: Number,
  bopf4: Number,
  bopf5: Number,
  bopf6: Number,
  bopf7: Number,
  bopf8: Number,
  bopf9: Number,
  bopf10: Number,
  bopf11: Number,
  bopf12: Number,
  bopf13: Number,
  bopf14: Number,
  bopf15: Number,
  dust: Number,
});

module.exports = mongoose.model("Process", ProcessSchema);
