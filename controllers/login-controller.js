const User = require('../models/user');

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