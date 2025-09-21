const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  cart: [
    {
      id: Number,
      name: String,
      price: Number,
      qty: Number,
    }
  ],
  totals: {
    subtotal: Number,
    shipping: Number,
    total: Number,
  },
  deliveryLocation: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Order", OrderSchema);
