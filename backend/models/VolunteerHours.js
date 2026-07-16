const mongoose = require("mongoose");

const VolunteerHoursSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  status: { 
    type: String, 
    default: "Pending" 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("VolunteerHours", VolunteerHoursSchema);