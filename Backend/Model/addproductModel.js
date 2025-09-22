const mongoose = require("mongoose");

const addProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  description: { type: String },
});

module.exports = mongoose.model("AddProduct", addProductSchema);
