const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (your portfolio)
app.use(express.static('public'));

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

// Contact form route
app.post('/contact', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Your email: usamaodho2005@gmail.com
    subject: `New Contact Form Submission: ${subject}`,
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});