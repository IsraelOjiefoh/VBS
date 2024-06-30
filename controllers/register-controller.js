const { generateConfirmationCode, generateAccountNumber, generatePin } = require('../utils/randomGenerators');


const { isAlpha, isValidEmail } = require('../utils/validators');

const sendConfirmationEmail = require('../sendMail/confirmationCode')

const sendAccountDetailsEmail = require('../sendMail/accountDetails'); // Import the default export

const User = require('../models/user');

let errors = [];

// Function to render the registration form with errors and previously entered data
const renderWithErrors = (req, res, errors, data) => {
  res.render('register', { errors, ...data });
};

// Controller function to render the registration page
exports.getRegister = (req, res) => {
  res.render('register', {
    errors: [], // Initialize with no errors
    first_name: '', // Initialize with empty first name
    last_name: '', // Initialize with empty last name
    email: '', // Initialize with empty email
  });
};

// Controller function to handle registration form submission
exports.postRegister = async (req, res) => {
  const { first_name, last_name, is_over_18, email } = req.body;

  // Check for missing fields
  if (!first_name || !last_name || !is_over_18 || !email) {
    errors.push({ msg: 'Please fill all the fields' });
  }

  // Validate first name
  if (!isAlpha(first_name)) {
    errors.push({ msg: 'First Name should contain only letters' });
  }
  if (first_name.length < 2 || first_name.length > 20) {
    errors.push({ msg: 'First Name must be between 2 and 20 letters' });
  }

  // Validate last name
  if (!isAlpha(last_name)) {
    errors.push({ msg: 'Last Name should contain only letters' });
  }
  if (last_name.length < 2 || last_name.length > 30) {
    errors.push({ msg: 'Last Name must be between 2 and 30 letters' });
  }

  // Validate email
  if (!isValidEmail(email)) {
    errors.push({ msg: 'Invalid Email Address Format' });
  }

  // Check if the user confirmed they are 18 or older
  if (!is_over_18) {
    errors.push({ msg: 'You must confirm that you are 18 years or older' });
  }

  // Render errors or proceed with registration
  if (errors.length > 0) {
    return renderWithErrors(req, res, errors, {
      first_name,
      last_name,
      is_over_18,
      email,
    });
  }

  // Generate a confirmation code and store it in the session
  const confirmationCode = generateConfirmationCode();
  req.session.confirmationCode = confirmationCode;
  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.email = email;
  req.session.accountNumber = generateAccountNumber();
  req.session.pin = generatePin();

  // Send confirmation email
  await sendConfirmationEmail(email, confirmationCode);
  console.log('Confirmation email sent');

  res.redirect('/confirm-email');
};

// Controller function to handle email confirmation form submission
exports.postConfirmationEmail = async (req, res) => {
  const { code } = req.body;

  // Check if the provided code matches the one in the session
  if (code !== req.session.confirmationCode) {
    errors.push({ msg: 'Invalid confirmation code.' });
  }

  // If there are errors, redirect back to confirmation page with error message
  if (errors.length > 0) {
    req.flash('errors', errors);
    return res.redirect('/confirm-email');
  }

  // Save user data to MongoDB with Mongoose
  try {
    const newUser = new User({
      first_name: req.session.first_name,
      last_name: req.session.last_name,
      accountNumber: req.session.accountNumber,
      pin: req.session.pin,
      email: req.session.email,
      is_over_18: true,
      email_verified: true,
      registration_date: new Date(),
    });
    await newUser.save();
    console.log('User registered:', newUser._id);

    // Send account details email
    await sendAccountDetailsEmail(req.session.email, req.session.first_name, req.session.last_name, req.session.accountNumber, req.session.pin);
    console.log('Account details email sent');

    res.redirect('/success');
  } catch (err) {
    console.error('Error confirming email:', err);
    req.flash('errors', { msg: 'Failed to confirm email' });
    res.redirect('/confirm-email');
  }
};

// Controller function to render the "success" page
exports.success = (req, res) => {
  const userEmail = req.session.email;

  // Render the "success" page with user email
  res.render('success', { userEmail });
};