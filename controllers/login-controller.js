const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Render login page and fetch account number if email is available
exports.getLogin = async (req, res) => {
    try {
        const email = req.flash('email')[0]; // Get the email from flash messages if it exists
        let accountNumber = '';
        if (email) {
            const user = await User.findOne({ email: email });
            if (user) {
                accountNumber = user.accountNumber;
            }
        }
        res.render('login', { accountNumber, errors: res.locals.errors });
    } catch (error) {
        console.error('Error fetching account number:', error);
        res.render('login', { accountNumber: '', errors: [{ msg: 'An error occurred, please try again' }] });
    }
};

// Handle login request
exports.postLogin = async (req, res) => {
    const { accountNumber, password } = req.body;

    try {
        const user = await User.findOne({ accountNumber });

        if (!user) {
            req.flash('error_msg', "Invalid credentials, please check your account number and password")
            return res.redirect('/auth/login')
        }

        const isMatch = await bcrypt.compare(password, user.pin);

        if (!isMatch) {
            req.flash('error_msg', "Invalid credentials, please check your account number and password")
            return res.redirect('/auth/login')
        }

        // Assuming login is successful
        req.session.user = user._id; // Store user ID in session or any other data you need
        return res.render("dashboard", {user});
    } catch (error) {
        console.error("An error occurred", error);
        return res.render("/auth/login");
    }
};