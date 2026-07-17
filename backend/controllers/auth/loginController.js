const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const handleLogin = async (req, res) => {

    try {
        const {emailAddress, password} = req.body;

        if (!emailAddress || !password) {
            return res.status(200).json({error: "Missing email or password"});
        }

        const user = await User.find({
            emailAddress
        });

        if (!user) {
            res.status(401).json({error: "No account found with information provided"});
        }

        const validPassword = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: req.secure || req.headers["x-forwarded-proto"] === "https",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({ accessToken, role: user.role });
        
    } catch(err) {
        res.status(500).json({error: err.message});
    } 


}