const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "public");
const trustProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS || "0", 10);
app.set("trust proxy", Number.isInteger(trustProxyHops) && trustProxyHops > 0 ? trustProxyHops : 0);

const contactHits = new Map();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const RATE_MAX_IPS = 5000;

const PROJECT_TYPES = new Set([
  "Website",
  "E-Commerce",
  "Web Application",
  "Management System",
  "UI / UX Design",
  "Backend / API",
  "Other"
]);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clientIp(req) {
  // Express only honors forwarded addresses when TRUST_PROXY_HOPS is configured.
  return String(req.ip || req.socket.remoteAddress || "unknown");
}

function rateLimit(ip) {
  const now = Date.now();
  let record = contactHits.get(ip);
  if (!record && contactHits.size >= RATE_MAX_IPS) {
    for (const [key, timestamps] of contactHits) {
      const recentHits = timestamps.filter((time) => now - time < RATE_WINDOW_MS);
      if (recentHits.length) contactHits.set(key, recentHits);
      else contactHits.delete(key);
    }
    if (contactHits.size >= RATE_MAX_IPS) return false;
  }
  record ||= [];
  const recent = record.filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    contactHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  contactHits.set(ip, recent);
  return true;
}

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'");
  const origin = req.headers.origin;
  const allowed = [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    process.env.SITE_URL
  ].filter(Boolean);
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  next();
});

app.use(express.static(publicPath, { extensions: ["html"] }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "DEV_STUDIO server is running.",
    mailConfigured: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  });
});

app.post("/api/contact", async (req, res) => {
  try {
    const ip = clientIp(req);
    if (!rateLimit(ip)) {
      return res.status(429).json({
        success: false,
        message: "Too many messages from this network. Please try again later."
      });
    }

    const body = req.body || {};
    if (String(body.website || "").trim()) {
      return res.json({ success: true, message: "Message sent successfully." });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const company = String(body.company || "").trim();
    const projectType = String(body.projectType || "").trim();
    const budget = String(body.budget || "").trim();
    const timeline = String(body.timeline || "").trim();
    const details = String(body.details || "").trim();
    const source = String(body.source || "").trim();

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ success: false, message: "Please enter a valid name." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (subject.length < 2 || subject.length > 120) {
      return res.status(400).json({ success: false, message: "Please enter a subject." });
    }
    if (!PROJECT_TYPES.has(projectType)) {
      return res.status(400).json({ success: false, message: "Please choose a valid project type." });
    }
    if (details.length < 20 || details.length > 1500) {
      return res.status(400).json({ success: false, message: "Please provide between 20 and 1500 characters about the project." });
    }
    if (company.length > 120 || budget.length > 80 || timeline.length > 80 || source.length > 80) {
      return res.status(400).json({ success: false, message: "One of the optional fields is too long." });
    }

    const payload = {
      name,
      email,
      subject,
      company: company || "Not provided",
      projectType,
      budget: budget || "Not specified",
      timeline: timeline || "Not specified",
      details,
      source: source || "Not specified",
      sentAt: new Date().toISOString()
    };

    const mailReady = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
    if (mailReady) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      const to = process.env.CONTACT_TO || process.env.GMAIL_USER;
      await transporter.sendMail({
        from: `"DEV_STUDIO" <${process.env.GMAIL_USER}>`,
        to,
        replyTo: email,
        subject: `Inquiry — ${escapeHtml(projectType)} — ${escapeHtml(subject)}`,
        text: [
          "New portfolio inquiry",
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          `Company: ${payload.company}`,
          `Project type: ${projectType}`,
          `Budget: ${payload.budget}`,
          `Timeline: ${payload.timeline}`,
          `Source: ${payload.source}`,
          `Date: ${payload.sentAt}`,
          "",
          details
        ].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;color:#14130f;background:#f3f1eb;padding:24px">
            <div style="max-width:640px;margin:auto;background:#fffcf8;border:1px solid #e8e4da;border-radius:16px;overflow:hidden">
              <div style="padding:24px;background:#14130f;color:#f3f0e7">
                <div style="letter-spacing:0.16em;font-size:12px">DEV_STUDIO</div>
                <h1 style="margin:8px 0 0;font-size:24px">New inquiry</h1>
              </div>
              <div style="padding:24px;line-height:1.6">
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <p><strong>Company:</strong> ${escapeHtml(payload.company)}</p>
                <p><strong>Project type:</strong> ${escapeHtml(projectType)}</p>
                <p><strong>Budget:</strong> ${escapeHtml(payload.budget)}</p>
                <p><strong>Timeline:</strong> ${escapeHtml(payload.timeline)}</p>
                <p><strong>Source:</strong> ${escapeHtml(payload.source)}</p>
                <p><strong>Date/time:</strong> ${escapeHtml(payload.sentAt)}</p>
                <div style="margin-top:16px;padding:16px;background:#f3f1eb;border-radius:12px;white-space:pre-wrap">${escapeHtml(details)}</div>
              </div>
            </div>
          </div>
        `
      });
    } else {
      console.log("Contact inquiry received (email is not configured):", {
        name,
        email,
        subject,
        projectType,
        sentAt: payload.sentAt
      });
    }

    return res.json({
      success: true,
      message: mailReady
        ? "Message sent successfully."
        : "Message received. Email delivery is not configured on this server yet."
    });
  } catch (error) {
    console.error("Contact form error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
});

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const notFound = path.join(publicPath, "404.html");
  if (fs.existsSync(notFound)) {
    return res.status(404).sendFile(notFound);
  }
  return res.status(404).type("html").send("<h1>404</h1><p>Page not found.</p>");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DEV_STUDIO running at http://localhost:${PORT}`);
  });
}

module.exports = app;
