// Import validation functions
const { isAlpha, isValidEmail } = require('./validators');

// Import the function to send confirmation emails
const { sendConfirmationEmail } = require('./mailer');

// Function to generate a random 6-digit confirmation code
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

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
exports.postRegister = (req, res) => {
    const { first_name, last_name, is_over_18, email } = req.body;

    let errors = [];

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

    // Generate a confirmation code
    const confirmationCode = generateConfirmationCode();
    req.session.confirmationCode = confirmationCode;
    req.session.email = email;

    // Send confirmation email
    sendConfirmationEmail(email, confirmationCode)
        .then(info => {
            console.log('Confirmation email sent:', info.messageId);
            res.redirect('/confirm-email'); // Redirect to email confirmation page
        })
        .catch(error => {
            console.error('Failed to send confirmation email:', error);
            req.flash('errors', { msg: 'Failed to send confirmation email' });
            res.redirect('/register'); // Redirect back to registration page on error
        });
};

// Controller function to handle email confirmation form submission
exports.postConfirmationEmail = (req, res) => {
    const { code } = req.body;
    let errors = [];

    // Check if the provided code matches the one in the session
    if (code !== req.session.confirmationCode) {
        
        errors.push({ msg: 'Invalid confirmation code.' });
        console.log(errors)
    }

    // If there are errors, redirect back to confirmation page with error message
    if (errors.length > 0) {
        req.flash('errors', errors);
        return res.redirect('/confirm-email');
    }

    // If code is correct, proceed with email confirmation logic
    // Mark email as verified in the database, etc.

    // Destroy the session after processing
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        } else {
            console.log('Session destroyed.');
        }
    });

    // Redirect to success page or do further processing
    res.send('Email Confirmed Successfully.');
};