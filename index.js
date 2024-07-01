const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const Controller = require('./controllers/register-controller');
const sendConfirmationEmail = require('./sendMail/confirmationCode');
const sendAccountDetailsEmail = require('./sendMail/accountDetails');
const User = require('./models/user');
const { generateConfirmationCode, generateAccountNumber, generatePin } = require('./utils/randomGenerators');
const { isAlpha, isValidEmail } = require('./utils/validators');

// Load environment variables from .env file
require('dotenv').config();

// Set the port to listen on
const port = process.env.PORT || 3000;

// Create an Express application
const app = express();

// Set the view engine to EJS for rendering HTML views
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies (form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to manage sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Middleware for flash messages
app.use(flash());

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
  res.locals.errors = req.flash('error_msg');
  next();
});

// MongoDB connection setup with Mongoose
mongoose.connect(process.env.URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Make the database connection available to the app
app.locals.db = db;

// Routes

// Home page route
app.get('/', (req, res) => {
    res.render('index');
});

// Registration routes
app.get('/register', Controller.getRegister);
app.post('/register', Controller.postRegister);

// Confirmation email routes
app.get('/confirm-email', (req, res) => {
    res.render('confirm-email');
});
app.post('/confirm-email', Controller.postConfirmationEmail);

// Success route
app.get('/success', Controller.success);

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = app; // Export the app for testing or other modules