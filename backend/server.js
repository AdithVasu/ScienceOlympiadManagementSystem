require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 6060;

const conn = require("./config/conn");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const eventScoreRoutes = require("./routes/eventScoreRoutes");

conn();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/volunteer-hours", volunteerRoutes);
app.use("/event-scores", eventScoreRoutes);

app.listen(PORT, () => {
    console.log(`Server is connected on PORT ${PORT}`);
});