const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    description: {type: String, required: true}, 
    date: { type: Date, required: true },
    timeBlock: { type: String, required: true },
    rsvps: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        isAttending: {type: Boolean, default: false}
    }]
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);