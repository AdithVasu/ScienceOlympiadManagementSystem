const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {

    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({error: "No access token provided"});
    }

    try {

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        res.status(401).json({ error: "Invalid or expired access token." });
    }

}