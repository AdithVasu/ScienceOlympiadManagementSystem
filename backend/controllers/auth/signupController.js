const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const handleSignup = async (req, res) => {

    try {
        const { firstName, lastName, emailAddress, password, confirmPassword } = req.body

        if (!firstName || !lastName || !emailAddress || !password || !confirmPassword || password !== confirmPassword) {
            return res.status(400).json({error: "Invalid login attempt. Please enter all fields and ensure passwords match"});
        }
    
        const duplicateUser = await User.findOne({
            emailAddress: emailAddress
        });
    
        if (duplicateUser) {
            return res.status(409).json({ error: "Email address is already registered. Please contact admin" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName, 
            lastName, 
            emailAddress, 
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully", userId: newUser._id });

    } catch(err) {
        return res.status(500).json({ error: err.message });
    }

}

module.exports = { handleSignup }