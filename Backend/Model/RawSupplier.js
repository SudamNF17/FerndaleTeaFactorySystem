const mongoose = require("mongoose");

const rawSupplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[0-9\s-]{7,15}$/, "Invalid phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    materialType: {
      type: String,
      required: [true, "Material type is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    pricePerUnit: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    leadTime: {
      type: String,
      default: "",
      trim: true,
    },
    certification: {
      type: String,
      default: "",
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    locationName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawSupplier", rawSupplierSchema);
