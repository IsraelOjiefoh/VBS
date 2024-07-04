const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.session.user;
        if (!userId) {
            req.flash('error_msg', 'User not logged in. Please log in again.');
            return res.render('login', { error_msg: 'User not logged in. Please log in again.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            req.flash('error_msg', 'User not found. Please log in again.');
            return res.render('login', { error_msg: 'User not found. Please log in again.' });
        }

        res.render('dashboard', { user, error_msg: req.flash('error_msg'), success_msg: req.flash('success_msg') });
    } catch (error) {
        console.error('Error fetching user details:', error);
        req.flash('error_msg', 'Failed to fetch user details. Please try again.');
        res.render('error', { error_msg: 'Failed to fetch user details. Please try again.' });
    }
});

module.exports = router;