// Import nodemailer for sending emails
const nodemailer = require('nodemailer');

// Load environment variables from .env file
require('dotenv').config();


// Function to send account details email
const sendAccountDetailsEmail = async (to, firstName, lastName, accountNumber, balance,pin) => {
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
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error); // Log error if verification fails
      } else {
        console.log("Server is ready to take our messages"); // Log success message
      }
    });

    // Define email options with account details
    const mailOptions = {
      from: `"Visual Banking Simulation"<${process.env.EMAIL_USER}>`,// Sender address
      to, // List of recipients
      subject: 'Your Account Details', // Subject line
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Here are your account details:</p>
        <ul>
          <li><b>First Name:</b> ${firstName}</li>
          <li><b>Last Name:</b> ${lastName}</li>
          <li><b>Account Number:</b> ${accountNumber}</li>
          <li><b>Current Balance:</b> ₦ ${balance}</li>
          <li><b>PIN:</b> ${pin}</li>
        </ul>
        <p>Please keep this information secure.</p>
        <p>Best regards,</p>
        <p>Virtual Banking Simulation </p>
      `, // HTML body
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

module.exports=sendAccountDetailsEmail