const mysql = require("mysql2/promise");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const ca = process.env.DB_CA_CERT
    ? process.env.DB_CA_CERT.replace(/\\n/g, "\n")
    : fs.readFileSync(
        path.join(__dirname, "../certs/ca.pem"),
        "utf8"
    );

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    timezone: '+05:30',
    ssl: {
    ca: ca
}
});
pool.on("connection", (connection) => {
    connection.query("SET time_zone = '+05:30'");
});
module.exports = pool;