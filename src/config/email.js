const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
});


const sendEmail = async (to, subject, text) => {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to, 
      subject,
      text,
    };
  
    try {
      await transport.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  module.exports = { sendEmail };