// Import required modules
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const Controller = require('./controller');

// Load environment variables from .env file
dotenv.config();

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
    secret: 'your-secret-key', // Secret key to sign the session ID cookie
    resave: false, // Do not save the session if it hasn't been modified
    saveUninitialized: true, // Save a new session that hasn't been initialized
}));

// Middleware to handle flash messages
app.use(flash());

// Middleware to make flash messages available in views
app.use((req, res, next) => {
    res.locals.errors = req.flash('errors');
    next();
});

// Route to render the home page
app.get('/', (req, res) => res.render('index'));

// Route to render the registration form
app.get('/register', Controller.getRegister);

// Route to handle registration form submission
app.post('/register', Controller.postRegister);

// Route to render the email confirmation form
app.get('/confirm-email', (req, res) => {
    res.render('confirm-email');
});

// Route to handle email confirmation form submission
app.post('/confirm-email', Controller.postConfirmationEmail);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});