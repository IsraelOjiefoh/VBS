// Import necessary modules
const { isAlpha, isValidEmail } = require('./validators');
const { sendConfirmationEmail } = require('./mailer');
const { ObjectId } = require('mongodb');

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
exports.postRegister = async (req, res) => {
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

    // Save user data to MongoDB
    try {
        const usersCollection = req.app.locals.db.collection('users');
        const newUser = {
            first_name,
            last_name,
            email,
            is_over_18: Boolean(is_over_18),
            registration_date: new Date(),
        };
        const result = await usersCollection.insertOne(newUser);
        console.log('User registered:', result.insertedId);

        // Generate a confirmation code and store it in the session
        const confirmationCode = generateConfirmationCode();
        req.session.confirmationCode = confirmationCode;
        req.session.email = email;

        // Send confirmation email
        sendConfirmationEmail(email, confirmationCode)
            .then(info => {
                console.log('Confirmation email sent:', info.messageId);
                res.redirect('/confirm-email');
            })
            .catch(error => {
                console.error('Failed to send confirmation email:', error);
                req.flash('errors', { msg: 'Failed to send confirmation email' });
                res.redirect('/register');
            });
    } catch (err) {
        console.error('Error registering user:', err);
        req.flash('errors', { msg: 'Failed to register user' });
        res.redirect('/register');
    }
};

// Controller function to handle email confirmation form submission
exports.postConfirmationEmail = async (req, res) => {
    const { code } = req.body;
    let errors = [];

    // Check if the provided code matches the one in the session
    if (code !== req.session.confirmationCode) {
        errors.push({ msg: 'Invalid confirmation code.' });
    }

    // If there are errors, redirect back to confirmation page with error message
    if (errors.length > 0) {
        req.flash('errors', errors);
        return res.redirect('/confirm-email');
    }

    // Update user record in MongoDB to mark email as verified
    try {
        const usersCollection = req.app.locals.db.collection('users');
        const emailToUpdate = req.session.email;
        const updateResult = await usersCollection.updateOne(
            { email: emailToUpdate },
            { $set: { email_verified: true } }
        );
        console.log('Email verified for:', emailToUpdate);

        req.session.destroy(); // Destroy session after processing

        res.redirect('/thank-you');
    } catch (err) {
        console.error('Error confirming email:', err);
        req.flash('errors', { msg: 'Failed to confirm email' });
        res.redirect('/confirm-email');
    }
}
