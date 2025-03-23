const { sendEmail } = require('../config/email');

const SendActivationAccount = async (req, res) => {
    try {
      const { to, subject, activationLink } = req.body;
  
      // Log the activationLink for debugging
      console.log('Received Activation Link:', activationLink);
  
      const emailText = `Click the link below to activate your account:\n\n${activationLink}`;
      await sendEmail(to, subject, emailText);
  
      res.status(200).json('Ok');
    } catch (error) {
      console.error('Error sending activation email:', error);
      res.status(500).json({ message: 'Error sending activation email', error: error.message });
    }
  };

module.exports = { SendActivationAccount };