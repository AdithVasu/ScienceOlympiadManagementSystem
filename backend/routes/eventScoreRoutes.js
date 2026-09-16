const express = require("express");
const router = express.Router();

const {
    createUserEvent,
    validateEventScore,
    invalidateEventScore,
    getEventScoresByEvent,
    getPendingEventScores,
    getApprovedUserEventScores,
    getPendingUserEventScores,
    updateEventScore,
    deleteEventScore
} = require("../controllers/eventScoreController");
const { verifyAuth } = require("../middleware/verifyAuth");
const { requireRole } = require("../middleware/verifyRole");

router.post("/", verifyAuth, createUserEvent);
router.patch("/:eventScoreId/validate", verifyAuth, requireRole(["Admin", "Volunteer"]), validateEventScore);
router.delete("/:eventScoreId/deny", verifyAuth, requireRole(["Admin", "Volunteer"]), invalidateEventScore);
router.get("/event/:eventId", verifyAuth, requireRole(["Admin", "Volunteer"]), getEventScoresByEvent);
router.get("/pending", verifyAuth, requireRole(["Admin", "Volunteer"]), getPendingEventScores);
router.get("/user/:userId/approved", verifyAuth, getApprovedUserEventScores);
router.get("/user/:userId/pending", verifyAuth, getPendingUserEventScores);
router.patch("/:eventScoreId", verifyAuth, updateEventScore);
router.delete("/:eventScoreId", verifyAuth, deleteEventScore);

module.exports = router;
