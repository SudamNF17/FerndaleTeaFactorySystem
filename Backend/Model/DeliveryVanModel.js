const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliveryVanSchema = new Schema({
     delivery_person_id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    phone_number: {
        type: String,
        required: true,
        match: [/^\+?[0-9]{7,15}$/, "Invalid phone number format"]
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "Invalid email format"]
    },
    van_number: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    availability_status: {
        type: String,
        enum: ['Available', 'On Delivery', 'Unavailable'],
        default: 'Available'
    },
    notes: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model(
    "deliveryVanModel", 
    deliveryVanSchema
)