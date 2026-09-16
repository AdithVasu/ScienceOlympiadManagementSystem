const express = require("express");
const router = express.Router();

const {
    createVolunteerHour,
    validateVolunteerHours,
    invalidateVolunteerHours,
    getPendingVolunteerHours,
    getValidVolunteerHours,
    getPendingVolunteerHoursById,
    getValidVolunteerHoursById,
    updateVolunteerHours,
    deleteVolunteerHours
} = require("../controllers/volunteerHoursController");
const { verifyAuth } = require("../middleware/verifyAuth");
const { requireRole } = require("../middleware/verifyRole");

router.post("/:userId", verifyAuth, requireRole(["Admin", "Volunteer"]), createVolunteerHour);
router.patch("/:volunteerHourId/validate", verifyAuth, requireRole(["Admin"]), validateVolunteerHours);
router.delete("/:volunteerHourId/deny", verifyAuth, requireRole(["Admin"]), invalidateVolunteerHours);
router.get("/pending", verifyAuth, requireRole(["Admin", "Volunteer"]), getPendingVolunteerHours);
router.get("/approved", verifyAuth, requireRole(["Admin", "Volunteer"]), getValidVolunteerHours);
router.get("/user/:userId/pending", verifyAuth, requireRole(["Admin", "Volunteer"]), getPendingVolunteerHoursById);
router.get("/user/:userId/approved", verifyAuth, requireRole(["Admin", "Volunteer"]), getValidVolunteerHoursById);
router.patch("/:volunteerHourId", verifyAuth, updateVolunteerHours);
router.delete("/:volunteerHourId", verifyAuth, deleteVolunteerHours);

module.exports = router;
