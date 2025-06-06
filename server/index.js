// index.js

const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
  },
});

// Contact form handler with reCAPTCHA verification
app.post("/api/contact", async (req, res) => {
  const { name, email, message, recaptcha } = req.body;

  if (!name || !email || !message || !recaptcha) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Verify reCAPTCHA
  try {
    const { data } = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET,
        response: recaptcha,
      },
    });

    if (!data.success || data.score < 0.5) {
      return res.status(403).json({ message: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    return res.status(500).json({ message: "reCAPTCHA verification error." });
  }

  // Send email
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

// Fallback to serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
