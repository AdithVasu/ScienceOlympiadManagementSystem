const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    emailAddress: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: Number, 
        default: 2
    },
    firstName: {type: String, required: true}, 
    lastName: {type: String, required: true},
    isVerified: {type: Boolean, required: true, default: false}

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
