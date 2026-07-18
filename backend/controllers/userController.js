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

        const unverifiedUsers = await User.find({isVerified: true}).select("firstName lastName emailAddress role");
        return res.status(200).json(unverifiedUsers);
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
    
}

const approveUser = async (req, res) => {
    try {

        const { userId } = req.params.id;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User is already verified." });
        }

        user.isApproved = true;
        await user.save();
        return res.status(200).json({ 
            message: `User ${user.emailAddress} has been successfully approved.` 
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = { getUnverifiedUsers, approveUser };
