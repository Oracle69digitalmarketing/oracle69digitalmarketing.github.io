const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check for Render
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// Recaptcha Verification Function
const verifyRecaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET;
  try {
    const res = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secret,
        response: token,
      },
    });
    return res.data.success;
  } catch (err) {
    console.error("Recaptcha error:", err);
    return false;
  }
};

// Email API Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message, token } = req.body;

  const isHuman = await verifyRecaptcha(token);
  if (!isHuman) {
    return res.status(400).json({ message: "Recaptcha verification failed." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL,
      subject: "New Contact Message",
      text: message,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
    });

    res.status(200).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
