const ROLES = {
    "Admin": 0,
    "Volunteer": 1,
    "Student": 2
};

const ROLE_NAMES = Object.fromEntries(
    Object.entries(ROLES).map(([name, value]) => [value, name])
);

const getRoleName = (roleValue) => ROLE_NAMES[roleValue] ?? "Unknown";

module.exports = ROLES;
module.exports.ROLE_NAMES = ROLE_NAMES;
module.exports.getRoleName = getRoleName;