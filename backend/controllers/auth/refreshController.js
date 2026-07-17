const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const handleRefresh = async (req, res) => {

    try {

        const cookies = req.cookies;
        if (!cookies?.refreshToken) {
            return res.status(401).json({ error: "No refresh token provided." });
        }

        const refreshToken = cookies.refreshToken;

        jwt.verify(refreshToken, 
            process.env.REFRESH_TOKEN_SECRET, 
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ error: "Invalid or expired refresh token." });
                }

                const foundUser = await User.findById(decoded.id);
                if (!foundUser) {
                    return res.status(401).json({ error: "User no longer exists." });
                }

                if (!foundUser.isApproved) {
                    return res.status(403).json({ error: "Account pending admin approval." });
                }

                const accessToken = jwt.sign(
                    { id: foundUser._id, role: foundUser.role },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "15m" }
                );

                return res.status(200).json({ accessToken, role: foundUser.role });
            });

    } catch (err) {
        res.status(500).json({error: err.message});
    }
    
}

module.exports = { handleRefresh };
