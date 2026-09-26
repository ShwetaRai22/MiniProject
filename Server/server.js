const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

db.query("SELECT 1")
    .then(() => {
        console.log("MySQL database connected!");
    })
    .catch((err) => {
        console.log("MySQL connection failed:", err.message);
    });
    
app.get("/", (req, res) => {
    res.send("ExamSphere Server is running!");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});