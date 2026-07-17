const ROLES = require("../config/roles");

const requireRole = (allowedRoleNames) => {
    return (req, res, next) => {
        if (!req.user || req.user.role === undefined) {
            return res.status(401).json({ error: "Unauthorized. User data missing." });
        }

        const allowedLevels = allowedRoleNames.map(name => ROLES[name]);

        if (!allowedLevels.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
        }

        next();
    };
};

module.exports = { requireRole };