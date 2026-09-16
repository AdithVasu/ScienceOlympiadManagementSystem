const User = require("../models/User");
const ROLES = require("../config/roles");

const getUnverifiedUsers = async (req, res) => {
    try {
        const unverifiedUsers = await User.find({ isVerified: false }).select("firstName lastName emailAddress role");
        return res.status(200).json(unverifiedUsers);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getVerifiedUsers = async (req, res) => {
    try {
        const verifiedUsers = await User.find({ isVerified: true }).select("firstName lastName emailAddress role");
        return res.status(200).json(verifiedUsers);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.isVerified || user.isApproved) {
            return res.status(400).json({ error: "User is already verified." });
        }

        user.isVerified = true;
        user.isApproved = true;
        await user.save();

        return res.status(200).json({
            message: `User ${user.emailAddress} has been successfully approved.`
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

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

        if (role !== undefined) {
            const numericRole = Number(role);
            if (!Object.values(ROLES).includes(numericRole)) {
                return res.status(400).json({ error: "Invalid role value." });
            }
            user.role = numericRole;
        }

        await user.save();

        return res.status(200).json({
            message: "User profile successfully updated.",
            user
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const transferAdminRole = async (req, res) => {
    try {
        const { newAdminId } = req.params;
        const currentUserId = req.user.id;

        if (!newAdminId) {
            return res.status(400).json({ error: "A target user is required." });
        }

        if (newAdminId === currentUserId) {
            return res.status(400).json({ error: "You cannot promote yourself while demoting your own admin role in the same action." });
        }

        const currentAdmin = await User.findById(currentUserId);
        if (!currentAdmin) {
            return res.status(404).json({ error: "Current admin user not found." });
        }

        if (currentAdmin.role !== ROLES.Admin) {
            return res.status(403).json({ error: "Only an admin can transfer admin rights." });
        }

        const targetUser = await User.findById(newAdminId);
        if (!targetUser) {
            return res.status(404).json({ error: "Target user not found." });
        }

        if (targetUser.role === ROLES.Admin) {
            return res.status(400).json({ error: "Target user is already an admin." });
        }

        const adminCount = await User.countDocuments({ role: ROLES.Admin });
        if (adminCount <= 1) {
            return res.status(400).json({ error: "You cannot demote yourself while you are the last active admin. Promote another admin first." });
        }

        currentAdmin.role = ROLES.Volunteer;
        targetUser.role = ROLES.Admin;

        await currentAdmin.save();
        await targetUser.save();

        return res.status(200).json({
            message: `Admin role transferred successfully. ${currentAdmin.firstName} ${currentAdmin.lastName} is now a volunteer and ${targetUser.firstName} ${targetUser.lastName} is now an admin.`
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

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
};

module.exports = {
    getUnverifiedUsers,
    getVerifiedUsers,
    approveUser,
    updateUser,
    transferAdminRole,
    deleteUser
};
