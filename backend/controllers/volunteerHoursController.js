const VolunteerHours = require("../models/VolunteerHours");
const User = require("../models/User");

const createVolunteerHour = async (req, res) => {
    try {
        const { userId } = req.params;
        const { date, hours } = req.body;

        // 1. Basic input validation
        if (!date || hours === undefined) {
            return res.status(400).json({ error: "Date and hours are required." });
        }

        if (typeof hours !== "number" || hours <= 0) {
            return res.status(400).json({ error: "Hours must be a positive number." });
        }

        // 2. Check if the volunteer user exists
        const volunteerUser = await User.findById(userId);
        if (!volunteerUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // 3. Create the volunteer hour record
        const newVolunteerHour = await VolunteerHours.create({
            volunteer: userId,
            date,
            hours
            // status defaults to "Pending" automatically via schema
        });

        // 4. Populate volunteer details for frontend response
        await newVolunteerHour.populate({
            path: "volunteer",
            select: "firstName lastName emailAddress"
        });

        return res.status(201).json({
            message: "Volunteer hours submitted successfully.",
            volunteerHour: newVolunteerHour
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const validateVolunteerHours = async (req, res) => {
    try {
        const { volunteerHourId } = req.params;
        const adminId = req.user.id; // Logged-in admin/supervisor

        const volunteerHour = await VolunteerHours.findById(volunteerHourId);

        if (!volunteerHour) {
            return res.status(404).json({ error: "Volunteer hours record not found." });
        }

        volunteerHour.status = "Approved";
        volunteerHour.approvedBy = adminId;

        await volunteerHour.save();

        await volunteerHour.populate([
            { path: "volunteer", select: "firstName lastName emailAddress" },
            { path: "approvedBy", select: "firstName lastName emailAddress" }
        ]);

        return res.status(200).json({
            message: "Successfully Validated",
            volunteerHour
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Invalidate / Deny & Auto-Delete Volunteer Hours (Admin / Supervisor)
const invalidateVolunteerHours = async (req, res) => {
    try {
        const { volunteerHourId } = req.params;

        const volunteerHour = await VolunteerHours.findById(volunteerHourId);

        if (!volunteerHour) {
            return res.status(404).json({ error: "Volunteer hours record not found." });
        }

        // Auto-delete on denial
        await volunteerHour.deleteOne();

        return res.status(200).json({ message: "Volunteer hours entry denied and deleted successfully." });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 1. Get All Pending Volunteer Hours (for Admins / Approvers)
const getPendingVolunteerHours = async (req, res) => {
    try {
        const pendingHours = await VolunteerHours.find({ status: "Pending" }).populate([
            { path: "volunteer", select: "firstName lastName emailAddress" }
        ]);

        return res.status(200).json(pendingHours);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 2. Get All Validated / Approved Volunteer Hours
const getValidVolunteerHours = async (req, res) => {
    try {
        const validHours = await VolunteerHours.find({ status: "Approved" }).populate([
            { path: "volunteer", select: "firstName lastName emailAddress" },
            { path: "approvedBy", select: "firstName lastName emailAddress" }
        ]);

        return res.status(200).json(validHours);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get Pending Volunteer Hours for a specific User
const getPendingVolunteerHoursById = async (req, res) => {
    try {
        const { userId } = req.params;

        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: "User not found." });
        }

        const pendingHours = await VolunteerHours.find({ 
            volunteer: userId, 
            status: "Pending" 
        }).populate([
            { path: "volunteer", select: "firstName lastName emailAddress" }
        ]);

        return res.status(200).json(pendingHours);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get Validated/Approved Volunteer Hours for a specific User
const getValidVolunteerHoursById = async (req, res) => {
    try {
        const { userId } = req.params;

        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: "User not found." });
        }

        const validHours = await VolunteerHours.find({ 
            volunteer: userId, 
            status: "Approved" 
        }).populate([
            { path: "volunteer", select: "firstName lastName emailAddress" },
            { path: "approvedBy", select: "firstName lastName emailAddress" }
        ]);

        return res.status(200).json(validHours);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 3. Update Volunteer Hours (Volunteer only - resets status to "Pending")
const updateVolunteerHours = async (req, res) => {
    try {
        const { volunteerHourId } = req.params;
        const { date, hours } = req.body;
        const currentUserId = req.user.id;

        const volunteerHour = await VolunteerHours.findById(volunteerHourId);

        if (!volunteerHour) {
            return res.status(404).json({ error: "Volunteer hours record not found." });
        }

        // Authorization check: Only the owner can update their record
        if (volunteerHour.volunteer.toString() !== currentUserId) {
            return res.status(403).json({ error: "Unauthorized: You can only update your own volunteer hours." });
        }

        if (date !== undefined) {
            volunteerHour.date = date;
        }

        if (hours !== undefined) {
            if (typeof hours !== "number" || hours <= 0) {
                return res.status(400).json({ error: "Hours must be a positive number." });
            }
            volunteerHour.hours = hours;
        }

        // Reset status to Pending and clear old approver on modification
        volunteerHour.status = "Pending";
        volunteerHour.approvedBy = undefined;

        await volunteerHour.save();

        await volunteerHour.populate([
            { path: "volunteer", select: "firstName lastName emailAddress" }
        ]);

        return res.status(200).json({
            message: "Volunteer hours updated successfully. Re-submitted for review.",
            volunteerHour
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 4. Delete Volunteer Hours (Volunteer owner or Admin)
const deleteVolunteerHours = async (req, res) => {
    try {
        const { volunteerHourId } = req.params;
        const currentUserId = req.user.id;

        const volunteerHour = await VolunteerHours.findById(volunteerHourId);

        if (!volunteerHour) {
            return res.status(404).json({ error: "Volunteer hours record not found." });
        }

        // Authorization check: Owner or Admin
        if (volunteerHour.volunteer.toString() !== currentUserId && req.user.role !== "Admin") {
            return res.status(403).json({ error: "Unauthorized to delete this record." });
        }

        await volunteerHour.deleteOne();

        return res.status(200).json({ message: "Volunteer hours record deleted successfully." });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createVolunteerHour,
    validateVolunteerHours,
    invalidateVolunteerHours,
    getPendingVolunteerHours,
    getValidVolunteerHours,
    getPendingVolunteerHoursById, 
    getValidVolunteerHoursById,
    updateVolunteerHours,
    deleteVolunteerHours
};