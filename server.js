const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;


/* ==========================================
   MIDDLEWARE
========================================== */

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/* ==========================================
   PUBLIC WEBSITE
========================================== */

const publicPath = path.join(__dirname, "public");

console.log("Public folder:", publicPath);

app.use(express.static(publicPath));


/* ==========================================
   HOME PAGE
========================================== */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});


/* ==========================================
   API HEALTH CHECK
========================================== */

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Team Portfolio server is running."
    });

});


/* ==========================================
   CONTACT TEST
========================================== */

app.post("/api/contact", (req, res) => {

    console.log("");
    console.log("=================================");
    console.log("NEW CONTACT FORM SUBMISSION");
    console.log("=================================");

    console.log(req.body);

    console.log("=================================");
    console.log("");

    res.json({
        success: true,
        message: "Contact form received successfully."
    });

});


/* ==========================================
   START SERVER
========================================== */

app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log("       TEAM PORTFOLIO");
    console.log("=================================");
    console.log(`Website: http://localhost:${PORT}`);
    console.log(`Health:  http://localhost:${PORT}/api/health`);
    console.log("");
    console.log("Public folder:");
    console.log(publicPath);
    console.log("=================================");
    console.log("");

});