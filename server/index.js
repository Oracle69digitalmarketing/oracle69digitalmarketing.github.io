const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or use 'smtp' with custom config
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_PASSWORD, // app-specific password or real one
  },
});

// Contact API with reCAPTCHA v3 verification
app.post("/api/contact", async (req, res) => {
  const { name, email, message, recaptcha } = req.body;

  if (!name || !email || !message || !recaptcha) {
    return res.status(400).json({ message: "All fields are required." });
  }

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

// Fallback to index.html for client-side routing (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
