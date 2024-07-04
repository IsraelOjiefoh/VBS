// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    accountNumber: { type: String, required: true },
    pin: { type: String, required: true },
    balance:{type: Number},
    is_over_18: { type: Boolean, required: true },
    registration_date: { type: Date, default: Date.now },
    email_verified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;