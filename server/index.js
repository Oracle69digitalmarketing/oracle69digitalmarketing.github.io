// server/index.js

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Or use "hotmail", "yahoo", or custom SMTP
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `New Message from Oracle69 Contact Form`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
});

// Serve frontend for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "contact.html")); // or index.html if default
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
