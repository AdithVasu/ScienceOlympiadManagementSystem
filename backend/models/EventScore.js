const mongoose = require("mongoose");

const eventScoreSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    score: { type: String, required: true },
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { 
      type: String, 
      default: "Pending" 
    }
}, { timestamps: true });

module.exports = mongoose.model("EventScore", eventScoreSchema);