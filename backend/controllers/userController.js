const User = require("../models/User");

const getUnverifiedUsers = async(req, res) => {
    try {

        const unverifiedUsers = await User.find({isVerified: false}).select("firstName lastName emailAddress role");
        return res.status(200).json(unverifiedUsers);
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
    
}

const getVerifiedUsers = async(req, res) => {
    try {

        const verifiedUsers = await User.find({isVerified: true}).select("firstName lastName emailAddress role");
        return res.status(200).json(verifiedUsers);
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
    
}

const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ _id: userId });
        
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User is already verified." });
        }

        user.isVerified = true;
        await user.save();
        
        return res.status(200).json({ 
            message: `User ${user.emailAddress} has been successfully approved.` 
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const updateUser = async (req, res) => {
    try {
        
        const { userId } = req.params; 
        const { firstName, lastName, emailAddress, role } = req.body;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (emailAddress !== undefined) user.emailAddress = emailAddress;
        if (role !== undefined) user.role = role;

        await user.save();
        
        return res.status(200).json({ 
            message: "User profile successfully updated.", 
            user 
        });


    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params; 

        const deletedUser = await User.findOneAndDelete({ _id: userId });
        
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({ 
            message: `User ${deletedUser.emailAddress} has been deleted.` 
        });

    } catch (err) { 
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { getUnverifiedUsers, getVerifiedUsers, approveUser, updateUser, deleteUser };
