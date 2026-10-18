const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const app = express();
const path = require("path");

const authRouter=require('./routes/auth');
const studentRouter=require('./routes/student');

app.use(cors(
    {origin:"https://legendary-space-couscous-4qwjv65pj5j9hgv4-5501.app.github.dev",
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, ".."), {
    dotfiles: "deny",
    index: "index.html"
}));

app.use('/api/auth',authRouter);
app.use('/api/student',studentRouter);




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
