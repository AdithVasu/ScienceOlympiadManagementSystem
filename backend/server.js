require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 6060;

const conn = require("./config/conn");


conn();

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, (req, res) => {
    console.log(`Server is connected on PORT ${PORT}`);
})