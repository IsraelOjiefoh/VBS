// Import necessary modules and utilities
const { generateConfirmationCode, generateAccountNumber, generatePin } = require('../utils/randomGenerators');
const { isAlpha, isValidEmail } = require('../utils/validators');
const { sendConfirmationEmail } = require('./mailer');
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

    // Generate account number and pin
    const accountNumber = generateAccountNumber();
    const pin = generatePin();

    // Save user data to MongoDB with Mongoose
    try {
        const newUser = new User({
            first_name,
            last_name,
            accountNumber,
            pin,
            email,
            is_over_18: Boolean(is_over_18),
            registration_date: new Date(),
        });
        await newUser.save();
        console.log('User registered:', newUser._id);

        // Generate a confirmation code and store it in the session
        const confirmationCode = generateConfirmationCode();
        req.session.confirmationCode = confirmationCode;
        req.session.email = email;

        // Send confirmation email
        await sendConfirmationEmail(email, confirmationCode);
        console.log('Confirmation email sent');

        // Redirect to confirm-email page
        res.redirect('/confirm-email');
    } catch (err) {
        errors.push({ msg: 'Failed to register user' });
        console.error('Error registering user:', err);
        res.redirect('/register');
    }
};

// Controller function to handle email confirmation form submission
exports.postConfirmationEmail = async (req, res) => {
    const { code } = req.body;

    // Check if the provided code matches the one in the session
    if (code !== req.session.confirmationCode) {
        errors.push({ msg: 'Invalid confirmation code.' });
        req.flash('errors', errors);
        return res.redirect('/confirm-email');
    }

    // Get email from session
    const emailToUpdate = req.session.email;

    try {
        // Find the user by email and update email_verified status
        const user = await User.findOneAndUpdate(
            { email: emailToUpdate },
            { $set: { email_verified: true } },
            { new: true } // Return updated document
        );

        if (!user) {
            throw new Error('User not found');
        }

        console.log('Email verified for:', emailToUpdate);

        // Clear session data
        delete req.session.confirmationCode;
        delete req.session.email;

        // Redirect to thank-you page
        res.redirect('/thank-you');
    } catch (err) {
        console.error('Error confirming email:', err);
        req.flash('errors', { msg: 'Failed to confirm email' });
        res.redirect('/confirm-email');
    }
};

// Controller function to render the "thank you" page
exports.thankYou = (req, res) => {
    const userEmail = req.session.email;

    // Render the "thank you" page with user email
    res.render('thank-you', { userEmail });
};