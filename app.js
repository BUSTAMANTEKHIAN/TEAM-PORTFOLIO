require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
==================================================
GMAIL CONFIGURATION
==================================================
*/

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


/*
==================================================
TEST GMAIL CONNECTION
==================================================
*/

transporter.verify((error, success) => {

    if (error) {
        console.error("❌ Gmail connection failed:");
        console.error(error.message);
    } else {
        console.log("✅ Gmail server is ready.");
    }

});


/*
==================================================
HEALTH CHECK
==================================================
*/

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Team Portfolio API is running."
    });

});


/*
==================================================
CONTACT / PROJECT INQUIRY
==================================================
*/

app.post("/api/contact", async (req, res) => {

    try {

        const {
            name,
            email,
            company,
            projectType,
            budget,
            timeline,
            details,
            source
        } = req.body;


        /*
        ==========================================
        VALIDATION
        ==========================================
        */

        if (!name || !email || !projectType || !details) {

            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });

        }


        if (details.trim().length < 20) {

            return res.status(400).json({
                success: false,
                message: "Please provide more details about your project."
            });

        }


        /*
        ==========================================
        EMAIL TO YOU
        ==========================================
        */

        const mailToTeam = {

            from: `"Team Portfolio Website" <${process.env.GMAIL_USER}>`,

            to: process.env.GMAIL_USER,

            replyTo: email,

            subject: `🚀 New Project Inquiry — ${projectType}`,

            html: `

                <!DOCTYPE html>

                <html>

                <head>

                    <meta charset="UTF-8">

                </head>

                <body style="
                    margin:0;
                    padding:30px;
                    background:#f5fbda;
                    font-family:Arial, sans-serif;
                    color:#450c3f;
                ">

                    <div style="
                        max-width:700px;
                        margin:auto;
                        background:white;
                        border-radius:16px;
                        overflow:hidden;
                        box-shadow:0 10px 40px rgba(69,12,63,0.12);
                    ">

                        <div style="
                            background:#450c3f;
                            padding:30px;
                            color:white;
                        ">

                            <div style="
                                font-size:14px;
                                letter-spacing:2px;
                                color:#b9d175;
                                margin-bottom:10px;
                            ">
                                TEAM PORTFOLIO
                            </div>

                            <h1 style="
                                margin:0;
                                font-size:28px;
                            ">
                                New Project Inquiry
                            </h1>

                            <p style="
                                margin:10px 0 0;
                                color:#d9efbd;
                            ">
                                Someone wants to work with your team.
                            </p>

                        </div>


                        <div style="padding:30px;">


                            <h2 style="
                                color:#450c3f;
                                margin-top:0;
                            ">
                                Client Information
                            </h2>


                            <table style="
                                width:100%;
                                border-collapse:collapse;
                            ">

                                <tr>
                                    <td style="
                                        padding:12px 0;
                                        font-weight:bold;
                                        width:180px;
                                    ">
                                        Name
                                    </td>

                                    <td style="padding:12px 0;">
                                        ${escapeHtml(name)}
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding:12px 0;
                                        font-weight:bold;
                                    ">
                                        Email
                                    </td>

                                    <td style="padding:12px 0;">
                                        <a
                                            href="mailto:${escapeHtml(email)}"
                                            style="color:#450c3f;"
                                        >
                                            ${escapeHtml(email)}
                                        </a>
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding:12px 0;
                                        font-weight:bold;
                                    ">
                                        Company
                                    </td>

                                    <td style="padding:12px 0;">
                                        ${escapeHtml(company || "Not provided")}
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding:12px 0;
                                        font-weight:bold;
                                    ">
                                        Project Type
                                    </td>

                                    <td style="padding:12px 0;">
                                        ${escapeHtml(projectType)}
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding:12px 0;
                                        font-weight:bold;
                                    ">
                                        Budget
                                    </td>

                                    <td style="padding:12px 0;">
                                        ${escapeHtml(budget || "Not specified")}
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding:12px 0;
                                        font-weight:bold;
                                    ">
                                        Timeline
                                    </td>

                                    <td style="padding:12px 0;">
                                        ${escapeHtml(timeline || "Not specified")}
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding:12px 0;
                                        font-weight:bold;
                                    ">
                                        Found Us Through
                                    </td>

                                    <td style="padding:12px 0;">
                                        ${escapeHtml(source || "Not specified")}
                                    </td>
                                </tr>

                            </table>


                            <hr style="
                                border:0;
                                border-top:1px solid #e5e5e5;
                                margin:25px 0;
                            ">


                            <h2 style="
                                color:#450c3f;
                            ">
                                Project Details
                            </h2>


                            <div style="
                                background:#f5fbda;
                                padding:20px;
                                border-radius:12px;
                                line-height:1.7;
                                white-space:pre-wrap;
                            ">
                                ${escapeHtml(details)}
                            </div>


                            <div style="
                                margin-top:30px;
                                padding:18px;
                                background:#b9d175;
                                border-radius:10px;
                                color:#450c3f;
                            ">

                                <strong>Quick Reply</strong>

                                <br>

                                Simply click
                                <strong>Reply</strong>
                                in Gmail to respond directly to the client.

                            </div>

                        </div>


                        <div style="
                            padding:20px 30px;
                            background:#450c3f;
                            color:#d9efbd;
                            font-size:12px;
                        ">

                            Sent automatically from your Team Portfolio website.

                        </div>

                    </div>

                </body>

                </html>

            `

        };


        /*
        ==========================================
        SEND EMAIL
        ==========================================
        */

        await transporter.sendMail(mailToTeam);


        /*
        ==========================================
        SUCCESS
        ==========================================
        */

        res.status(200).json({

            success: true,

            message: "Your project inquiry has been sent successfully."

        });


    } catch (error) {

        console.error("❌ Contact form error:");
        console.error(error);

        res.status(500).json({

            success: false,

            message: "Something went wrong while sending your inquiry."

        });

    }

});


/*
==================================================
HTML ESCAPE FUNCTION
==================================================
*/

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/*
==================================================
START SERVER
==================================================
*/

app.listen(PORT, () => {

    console.log("");
    console.log("====================================");
    console.log("   TEAM PORTFOLIO SERVER");
    console.log("====================================");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Gmail: ${process.env.GMAIL_USER}`);
    console.log("====================================");
    console.log("");

});