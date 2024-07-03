const bcrypt = require('bcryptjs');
const { generateConfirmationCode, generateAccountNumber, generatePin } = require('../utils/randomGenerators');
const { isAlpha, isValidEmail } = require('../utils/validators');
const sendConfirmationEmail = require('../sendMail/confirmationCode');
const sendAccountDetailsEmail = require('../sendMail/accountDetails');
const User = require('../models/user');

// Function to render the registration form with errors and previously entered data
const renderWithErrors = (req, res, errors, data) => {
  res.render('register', { errors, ...data });
};

// Controller function to render the registration page
exports.getRegister = (req, res) => {
  res.render('register', {
    first_name: '',
    last_name: '',
    email: '',
  });
};

exports.postRegister = async (req, res) => {
  const { first_name, last_name, is_over_18, email } = req.body;

  
  const errors = [];
  const balance = 500000.00

  
  // Check for missing fields
  if (!first_name || !last_name || !is_over_18 || !email) {
    errors.push('Please fill all the fields');
  }

  // Validate first name
  if (!isAlpha(first_name)) {
    errors.push('First Name should contain only letters');
  }
  if (first_name.length < 2 || first_name.length > 20) {
    errors.push('First Name must be between 2 and 20 letters');
  }

  // Validate last name
  if (!isAlpha(last_name)) {
    errors.push('Last Name should contain only letters');
  }
  if (last_name.length < 2 || last_name.length > 30) {
    errors.push('Last Name must be between 2 and 30 letters');
  }

  // Validate email
  if (!isValidEmail(email)) {
    errors.push('Invalid Email Address Format');
  }

  // Check if the user confirmed they are 18 or older
  if (!is_over_18) {
    errors.push('You must confirm that you are 18 years or older');
  }

  // Check if email is already existing in DB
  try {
    const existingUser = await User.findOne({ email});

    if (existingUser) {
      req.flash('email', email)
      req.flash('error_msg',"It seems you've already registered with us. Please log in to proceed.");
      return res.redirect('/auth/login');
    }
  } catch (error) {
    console.log("Unable to check if user exists", error);
    req.flash('error_msg', 'An error occurred, please try again');
    return res.redirect('/auth/register');
  }

  // Render errors or proceed with registration
  if (errors.length > 0) {
    return renderWithErrors(req, res, errors, { first_name, last_name, is_over_18, email });
  }

  // Generate a confirmation code and store it in the session
  const confirmationCode = generateConfirmationCode();
  req.session.confirmationCode = confirmationCode;
  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.email = email;
  req.session.accountNumber = generateAccountNumber();
  req.session.balance = balance 
  req.session.pin = generatePin();

  // Hash user PIN before sending to DB
  try {
    const saltRounds = 10;
    const hashedPin = await bcrypt.hash(req.session.pin, saltRounds);
    req.session.hashedPin = hashedPin;
    console.log('Hashed PIN:', hashedPin);
  } catch (error) {
    console.log("Error hashing pin:", error);
    req.flash('error_msg', 'An error occurred, please try again');
    return res.redirect('/auth/register');
  }

  // Send confirmation email
  try {
    await sendConfirmationEmail(email, confirmationCode);
    console.log('Confirmation email sent');
    res.redirect('/auth/confirm-email');
  } catch (error) {
    console.log("An error occurred sending confirmation email:", error);
    req.flash('error_msg', 'An error occurred, please try again');
    res.redirect('/auth/register');
  }
};

// Controller function to handle email confirmation form submission
exports.postConfirmationEmail = async (req, res) => {
  const { code } = req.body;

  // Check if the provided code matches the one in the session
  if (code !== req.session.confirmationCode) {
    req.flash('error_msg', 'Invalid confirmation code.');
    return res.redirect('/auth/confirm-email');
  }

  // Save user data to MongoDB with Mongoose
  try {
    const newUser = new User({
      first_name: req.session.first_name,
      last_name: req.session.last_name,
      accountNumber: req.session.accountNumber,
      balance:req.session.balance,
      pin: req.session.hashedPin,
      email: req.session.email,
      is_over_18: true,
      email_verified: true,
      registration_date: new Date(),
    });
    await newUser.save();
    console.log('User registered:', newUser._id);

    // Send account details email
    await sendAccountDetailsEmail(req.session.email, req.session.first_name, req.session.last_name, req.session.accountNumber, 
req.session.balance,                               req.session.pin);
    console.log('Account details email sent');

    res.redirect('/auth/success');
  } catch (err) {
    console.error('Error confirming email:', err);
    req.flash('error_msg', 'Failed to confirm email');
    res.redirect('/auth/confirm-email');
  }
};

// Controller function to render the "success" page
exports.success = (req, res) => {
  const userEmail = req.session.email;
  // Render the "success" page with user email
  res.render('success', { userEmail });
};