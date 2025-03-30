const { sendEmail } = require('../config/email');

const SendActivationAccount = async (req, res) => {
    try {
      const { to, subject, activationLink } = req.body;
    
      const emailText = `Click the link below to activate your account:\n\n${activationLink}`;
      await sendEmail(to, subject, emailText);
  
      res.status(200).json('Ok');
    } catch (error) {
      console.error('Error sending activation email:', error);
      res.status(500).json({ message: 'Error sending activation email', error: error.message });
    }
  };

const sendUserStatusUpdateToBarber = async (to, bookingDetails) => {
    try {
        const subject = 'Booking Status Update - Client Action';
        const emailText = `
Dear ${bookingDetails.barberName},

A client has updated their booking status.

Booking Details:
Date: ${new Date(bookingDetails.date).toLocaleDateString()}
Time: ${bookingDetails.time}
Client: ${bookingDetails.userName}
Status: ${bookingDetails.status}

Please log in to your dashboard to view the updated booking.

Best regards,
Barber Shop Team
        `;
        await sendEmail(to, subject, emailText);
    } catch (error) {
        console.error('Error sending status update to barber:', error);
        throw error;
    }
};

const sendBarberStatusUpdateToUser = async (to, bookingDetails) => {
    try {
        const subject = 'Booking Status Update - Barber Action';
        const emailText = `
Dear ${bookingDetails.userName},

Your booking status has been updated by the barber.

Booking Details:
Date: ${new Date(bookingDetails.date).toLocaleDateString()}
Time: ${bookingDetails.time}
Barber: ${bookingDetails.barberName}
Status: ${bookingDetails.status}

Please log in to your account to view the updated booking.

Best regards,
Barber Shop Team
        `;
        await sendEmail(to, subject, emailText);
    } catch (error) {
        console.error('Error sending status update to user:', error);
        throw error;
    }
};

const sendNewBookingNotification = async (to, bookingDetails) => {
    try {
        const subject = 'New Booking Request';
        const emailText = `
Dear ${bookingDetails.barberName},

You have received a new booking request.

Booking Details:
Date: ${new Date(bookingDetails.date).toLocaleDateString()}
Time: ${bookingDetails.time}
Client: ${bookingDetails.userName}
Client Email: ${bookingDetails.userEmail}
Client Phone: ${bookingDetails.userPhone}

Please log in to your dashboard to manage this booking.

Best regards,
Barber Shop Team
        `;
        await sendEmail(to, subject, emailText);
    } catch (error) {
        console.error('Error sending new booking notification:', error);
        throw error;
    }
};

const sendBookingCancellationNotification = async (to, bookingDetails) => {
    try {
        const subject = 'Booking Cancellation';
        const emailText = `
Dear ${bookingDetails.barberName},

A booking has been cancelled.

Cancelled Booking Details:
Date: ${new Date(bookingDetails.date).toLocaleDateString()}
Time: ${bookingDetails.time}
Client: ${bookingDetails.userName}
Client Email: ${bookingDetails.userEmail}

Best regards,
Barber Shop Team
        `;
        await sendEmail(to, subject, emailText);
    } catch (error) {
        console.error('Error sending booking cancellation notification:', error);
        throw error;
    }
};

const sendCredentialsNotification = async (user, plainPassword) => {
  try {
    const subject = 'Your Account Credentials';
    const emailText = `
Dear ${user.name} ${user.lastname},

An administrator has created an account for you at our Barber Shop system.

Your account details:
Username: ${user.username}
Email: ${user.email}
Password: ${plainPassword}

Your account is already activated, and you can log in immediately using these credentials.
We recommend changing your password after your first login for security purposes.

Best regards,
Barber Shop Team
    `;
    await sendEmail(user.email, subject, emailText);
    console.log(`Credentials email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw error;
  }
};

const sendAccountUpdateNotification = async (user, updateInfo) => {
  try {
    const recipients = updateInfo.emailChanged 
      ? [updateInfo.originalEmail, user.email] 
      : [user.email];
    
    const subject = 'Your Account Has Been Updated';
    
    let emailText = `
Dear ${user.name} ${user.lastname},

Your account has been updated by an administrator.

`;

    if (updateInfo.emailChanged) {
      emailText += `
Your email address has been changed:
- Previous email: ${updateInfo.originalEmail}
- New email: ${user.email}

`;
    }

    if (updateInfo.passwordChanged) {
      emailText += `
Your password has been reset. Here is your new password:
${updateInfo.plainPassword}

For security reasons, we recommend changing this password after you log in.

`;
    }

    emailText += `
If you did not request these changes, please contact our support team immediately.

Best regards,
Barber Shop Team
    `;

    for (const recipient of recipients) {
      await sendEmail(recipient, subject, emailText);
      console.log(`Account update notification sent to ${recipient}`);
    }
  } catch (error) {
    console.error('Error sending account update notification:', error);
    throw error;
  }
};

module.exports = { 
    SendActivationAccount,
    sendUserStatusUpdateToBarber,
    sendBarberStatusUpdateToUser,
    sendNewBookingNotification,
    sendBookingCancellationNotification,
    sendCredentialsNotification,
    sendAccountUpdateNotification
};