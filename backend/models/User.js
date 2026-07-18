const mongoose = require("mongoose");
const ROLES = require("../config/roles");

const userSchema = new mongoose.Schema({
    emailAddress: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: Number, 
        default: ROLES.Student
    },
    firstName: {type: String, required: true}, 
    lastName: {type: String, required: true},
    isVerified: {type: Boolean, required: true, default: false}, 
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
