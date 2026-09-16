const express = require("express");
const router = express.Router();

const {
    createEvent,
    getAllEvents,
    updateEvent,
    rsvpToEvent,
    unRSVPForEvent,
    getRSVPedUsers,
    deleteEvent
} = require("../controllers/eventController");
const { verifyAuth } = require("../middleware/verifyAuth");
const { requireRole } = require("../middleware/verifyRole");

router.get("/", getAllEvents);
router.post("/", verifyAuth, requireRole(["Admin", "Volunteer"]), createEvent);
router.patch("/:eventId", verifyAuth, requireRole(["Admin", "Volunteer"]), updateEvent);
router.delete("/:eventId", verifyAuth, requireRole(["Admin", "Volunteer"]), deleteEvent);
router.post("/:eventId/rsvp", verifyAuth, rsvpToEvent);
router.delete("/:eventId/rsvp", verifyAuth, unRSVPForEvent);
router.get("/:eventId/rsvps", verifyAuth, requireRole(["Admin", "Volunteer"]), getRSVPedUsers);

module.exports = router;
