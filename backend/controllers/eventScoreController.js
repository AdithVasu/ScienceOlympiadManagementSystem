const EventScore = require("../models/EventScore");
const Event = require("../models/Event");
const User = require("../models/User");

// 1. Create a new EventScore
const createUserEvent = async (req, res) => {
    try {
        const { eventId, score, partners = [] } = req.body;
        const studentId = req.user.id;

        if (!eventId || score === undefined) {
            return res.status(400).json({ error: "eventId and score are required." });
        }

        const event = await Event.findOne({ _id: eventId });
        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        const student = await User.findOne({ _id: studentId });
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        for (let partnerId of partners) {
            const partnerUser = await User.findOne({ _id: partnerId });
            if (!partnerUser) {
                return res.status(400).json({ error: `Partner with ID ${partnerId} does not exist.` });
            }
        }

        const newEventScore = await EventScore.create({
            student: studentId,
            event: eventId,
            score,
            partners
        });

        await newEventScore.populate([
            { path: "student", select: "firstName lastName emailAddress" },
            { path: "partners", select: "firstName lastName emailAddress" },
            { path: "event", select: "name description date timeBlock" }
        ]);

        return res.status(201).json({
            message: "Event score submitted successfully.",
            eventScore: newEventScore
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 2. Validate / Approve an EventScore (Admin / Volunteer)
const validateEventScore = async (req, res) => {
    try {
        const { eventScoreId } = req.params;

        const eventScore = await EventScore.findById(eventScoreId);

        if (!eventScore) {
            return res.status(404).json({ error: "Event Score Card Not Found" });
        }

        eventScore.status = "Approved";
        await eventScore.save();

        await eventScore.populate([
            { path: "student", select: "firstName lastName emailAddress" },
            { path: "partners", select: "firstName lastName emailAddress" },
            { path: "event", select: "name description date timeBlock" }
        ]);

        return res.status(200).json({
            message: "Successfully Validated",
            eventScore
        });
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 3. Deny & Auto-Delete an EventScore (Admin / Volunteer)
const invalidateEventScore = async (req, res) => {
    try {
        const { eventScoreId } = req.params;

        const eventScore = await EventScore.findById(eventScoreId);

        if (!eventScore) {
            return res.status(404).json({ error: "Event Score Card Not Found" });
        }

        // Auto-delete on denial
        await eventScore.deleteOne();

        return res.status(200).json({ message: "Score entry denied and deleted successfully." });
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 4. Get Approved EventScores for a specific Event
const getEventScoresByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const testEvent = await Event.findById(eventId);

        if (!testEvent) {
            return res.status(404).json({ error: "No Event Found" });
        }

        const eventScores = await EventScore.find({ event: eventId, status: "Approved" }).populate([
            { path: "student", select: "firstName lastName emailAddress" },
            { path: "partners", select: "firstName lastName emailAddress" },
            { path: "event", select: "name description date timeBlock" }
        ]);

        return res.status(200).json(eventScores);
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 5. Get All Pending EventScores for Admins/Volunteers
const getPendingEventScores = async (req, res) => {
    try {
        const pendingScores = await EventScore.find({ status: "Pending" }).populate([
            { path: "student", select: "firstName lastName emailAddress" },
            { path: "partners", select: "firstName lastName emailAddress" },
            { path: "event", select: "name description date timeBlock" }
        ]);

        return res.status(200).json(pendingScores);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get all APPROVED event scores where the user is either the primary student OR a partner
const getApprovedUserEventScores = async (req, res) => {
    try {
        const { userId } = req.params;

        const scores = await EventScore.find({
            status: "Approved",
            $or: [
                { student: userId },
                { partners: userId }
            ]
        }).populate([
            { path: "student", select: "firstName lastName emailAddress" },
            { path: "partners", select: "firstName lastName emailAddress" },
            { path: "event", select: "name description date timeBlock" }
        ]);

        return res.status(200).json(scores);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get all PENDING event scores where the user is either the primary student OR a partner
const getPendingUserEventScores = async (req, res) => {
    try {
        const { userId } = req.params;

        const scores = await EventScore.find({
            status: "Pending",
            $or: [
                { student: userId },
                { partners: userId }
            ]
        }).populate([
            { path: "student", select: "firstName lastName emailAddress" },
            { path: "partners", select: "firstName lastName emailAddress" },
            { path: "event", select: "name description date timeBlock" }
        ]);

        return res.status(200).json(scores);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 6. Update EventScore (Submitter only)
const updateEventScore = async (req, res) => {
    try {
        const { eventScoreId } = req.params;
        const { score, partners } = req.body;
        const studentId = req.user.id;

        const eventScore = await EventScore.findById(eventScoreId);

        if (!eventScore) {
            return res.status(404).json({ error: "Event Score Card Not Found" });
        }

        // Authorization check: Only original student can update
        if (eventScore.student.toString() !== studentId) {
            return res.status(403).json({ error: "Unauthorized: You can only update your own score." });
        }

        if (score !== undefined) {
            eventScore.score = score;
        }

        if (partners && Array.isArray(partners)) {
            for (let partnerId of partners) {
                const partnerUser = await User.findOne({ _id: partnerId });
                if (!partnerUser) {
                    return res.status(400).json({ error: `Partner with ID ${partnerId} does not exist.` });
                }
            }
            eventScore.partners = partners;
        }

        // Reset status back to Pending if modified after approval
        eventScore.status = "Pending";

        await eventScore.save();

        await eventScore.populate([
            { path: "student", select: "firstName lastName emailAddress" },
            { path: "partners", select: "firstName lastName emailAddress" },
            { path: "event", select: "name description date timeBlock" }
        ]);

        return res.status(200).json({
            message: "Event score updated successfully. Re-submitted for review.",
            eventScore
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// 7. Delete EventScore (Manual user/admin deletion)
const deleteEventScore = async (req, res) => {
    try {
        const { eventScoreId } = req.params;
        const studentId = req.user.id;

        const eventScore = await EventScore.findById(eventScoreId);

        if (!eventScore) {
            return res.status(404).json({ error: "Event Score Card Not Found" });
        }

        // Authorization check: Submitter or Admin
        if (eventScore.student.toString() !== studentId && req.user.role !== "Admin") {
            return res.status(403).json({ error: "Unauthorized to delete this score card." });
        }

        await eventScore.deleteOne();

        return res.status(200).json({ message: "Event score card deleted successfully." });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { 
    createUserEvent, 
    validateEventScore, 
    invalidateEventScore, 
    getEventScoresByEvent,
    getPendingEventScores,
    getApprovedUserEventScores, 
    getApprovedUserEventScores,
    updateEventScore,
    deleteEventScore
};