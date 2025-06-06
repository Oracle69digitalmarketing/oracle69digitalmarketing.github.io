const axios = require('axios');

app.post('/contact', async (req, res) => {
  const { name, email, message, token } = req.body;

  if (!name || !email || !message || !token) {
    return res.status(400).json({ error: 'All fields including CAPTCHA are required.' });
  }

  // Verify CAPTCHA with Google
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`;
  try {
    const { data } = await axios.post(verifyURL);
    if (!data.success) {
      return res.status(400).json({ error: 'CAPTCHA verification failed.' });
    }
  } catch {
    return res.status(500).json({ error: 'CAPTCHA check failed.' });
  }

  // Proceed to send email (same as before)
  // ...
});
