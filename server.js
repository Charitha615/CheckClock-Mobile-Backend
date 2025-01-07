require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const  getEmailTemplate  = require('./utils/getEmailTemplate');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create an SNS client
const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS Access Key ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS Secret Access Key
  },
});

// Nodemailer transport configuration for email
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Twilio client configuration for SMS
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// API Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { to_name, to_email, contact_person, alarm_time, elapsed_time, support_contact } = req.body;

  if (!to_name || !to_email  || !contact_person || !alarm_time || !elapsed_time || !support_contact) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const mailOptions = {
    from: process.env.MAIL_USERNAME, // Sender address
    to: to_email, // Recipient email
    subject: `【重要】操作未確認によるアラーム通知`, // Subject line
    html: getEmailTemplate(contact_person, alarm_time, elapsed_time, support_contact), // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error });
  }
});

// API Endpoint to send SMS
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to, // Recipient's phone number
    });
    res.status(200).json({ success: true, message: 'SMS sent successfully!' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, message: 'Failed to send SMS', error });
  }
});

// API Endpoint to send SMS using AWS SNS
app.post('/send-sms-sns', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const params = {
      Message: message, // The message to send
      PhoneNumber: to,  // The recipient's phone number, in E.164 format (e.g., +1234567890)
    };

    const command = new PublishCommand(params);
    const result = await snsClient.send(command);

    res.status(200).json({ success: true, message: 'SMS sent successfully!', result });
  } catch (error) {
    console.error('Error sending SMS via AWS SNS:', error);
    res.status(500).json({ success: false, message: 'Failed to send SMS', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
