// Import nodemailer for sending emails
const nodemailer = require('nodemailer');

// Load environment variables from .env file
require('dotenv').config();

// Function to send a confirmation email
const sendConfirmationEmail = async (to, code) => {
  try {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail as the email service
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS // Use the app-specific password
      }
    });

    // Verify connection configuration
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error); // Log error if verification fails
      } else {
        console.log("Server is ready to take our messages"); // Log success message
      }
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // List of recipients
      subject: 'Email Confirmation', // Subject line
      html: `<p>Please use the following code to confirm your email: <b>${code}</b></p>`, // HTML body
    };

    // Send email
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error); // Log error if sending fails
          reject(error); // Reject the promise with the error
        } else {
          console.log('Message sent: %s', info.messageId); // Log the message ID
          resolve(info); // Resolve the promise with the info
        }
      });
    });
  } catch (error) {
    console.error('Error sending email:', error); // Log any other errors
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Export the sendConfirmationEmail function
module.exports = { sendConfirmationEmail };