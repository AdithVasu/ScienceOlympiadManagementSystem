const mongoose = require("mongoose");

const conn = async () => {
    try {

        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Database Connected");

    } catch (err) {
        console.log(err);
    }
}

module.exports = conn;