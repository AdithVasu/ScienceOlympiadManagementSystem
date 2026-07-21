const Event = require("../models/Event");

const createEvent = async(req, res) => {
    try {

        const {name, description, date, timeBlock} = req.body;

        if (!name || !description || !date || !timeBlock) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newEvent = await Event.create({
            name,
            description,
            date,
            timeBlock
        });

        return res.status(201).json({ 
            message: "Event created successfully.", 
            event: newEvent 
        });  
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("rsvps.user", "firstName lastName emailAddress");
        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name, description, date, timeBlock } = req.body;

        const event = await Event.findOne({ _id: eventId });

        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        if (name !== undefined) event.name = name;
        if (description !== undefined) event.description = description;
        if (date !== undefined) event.date = date;
        if (timeBlock !== undefined) event.timeBlock = timeBlock;

        await event.save();

        return res.status(200).json({
            message: "Event updated successfully.",
            event
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const rsvpToEvent = async (req, res) => {
    try {

        const { eventId } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        let alreadyRsvpd = false;

        for (let rsvp of event.rsvps) {
            if (rsvp.user.toString() === userId) {
                alreadyRsvpd = true;
                break;
            }
        }

        if (alreadyRsvpd) {
            return res.status(400).json({ error: "You have already RSVP'd to this event." });
        }

        event.rsvps.push({ user: userId, isAttending: true });
        await event.save();

        await event.populate("rsvps.user", "firstName lastName emailAddress");

        return res.status(200).json({
            message: "Successfully RSVP'd to event.",
            event
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


const unRSVPForEvent = async (req, res) => {

    try {

        const { eventId } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }


        let userIsAttending = false;
        for (let rsvp of event.rsvps) {
            if (rsvp.user.toString() === userId) {

                userIsAttending = true;
                break; 
            }
        }

        if (!userIsAttending) {
            return res.status(404).json({ error: "User was not originally RSVPed" });
        }

        event.rsvps.pull({ user: userId });

        await event.save();

        await event.populate("rsvps.user", "firstName lastName emailAddress");

        return res.status(200).json({
            message: "Successfully Un-RSVP'd to event.",
            event
        });


    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const getRSVPedUsers = async(req, res) => {
    try {

        const { eventId } = req.params;

        const event = await Event.findById(eventId).populate("rsvps.user", "firstName lastName emailAddress");

        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        return res.status(200).json(event.rsvps);


    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const deletedEvent = await Event.findOneAndDelete({ _id: eventId });
        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found." });
        }

        return res.status(200).json({ 
            message: `Event '${deletedEvent.name}' has been deleted.` 
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    updateEvent,
    rsvpToEvent,
    unRSVPForEvent,
    getRSVPedUsers,
    deleteEvent
};
