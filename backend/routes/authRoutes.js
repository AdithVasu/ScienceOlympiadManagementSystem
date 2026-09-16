const express = require("express");
const router = express.Router();

const { handleSignup } = require("../controllers/auth/signupController");
const { handleLogin } = require("../controllers/auth/loginController");
const { handleRefresh } = require("../controllers/auth/refreshController");
const { requestPasswordReset, resetPassword } = require("../controllers/auth/passwordResetController");
const { verifyAuth } = require("../middleware/verifyAuth");
const { requireRole } = require("../middleware/verifyRole");
const { getUnverifiedUsers, getVerifiedUsers, approveUser, updateUser, transferAdminRole, deleteUser } = require("../controllers/userController");

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/refresh", handleRefresh);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.get("/users/unverified", verifyAuth, requireRole(["Admin"]), getUnverifiedUsers);
router.get("/users/verified", verifyAuth, requireRole(["Admin", "Volunteer"]), getVerifiedUsers);
router.patch("/users/:userId/approve", verifyAuth, requireRole(["Admin"]), approveUser);
router.patch("/users/:userId", verifyAuth, requireRole(["Admin"]), updateUser);
router.patch("/users/transfer-admin/:newAdminId", verifyAuth, requireRole(["Admin"]), transferAdminRole);
router.delete("/users/:userId", verifyAuth, requireRole(["Admin"]), deleteUser);

module.exports = router;
