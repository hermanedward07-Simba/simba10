const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to read JSON data from the frontend

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Your 16-character App Password goes here
    }
});

// Route to handle form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // What the email will look like when it arrives in your inbox
    const mailOptions = {
        from: email, 
        to: process.env.EMAIL_USER, // Sends the email TO yourself
        subject: `New Portfolio Message from ${name}`,
        text: `You have received a new message from your portfolio contact form:\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n\n` +
              `Message:\n${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});