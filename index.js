const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const Controller = require('./controllers/register-controller');

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

// Middleware to handle flash messages
app.use(flash());

// Middleware to make flash messages available in views
app.use((req, res, next) => {
    res.locals.errors = req.flash('errors');
    next();
});

// MongoDB connection setup with Mongoose
mongoose.connect(process.env.URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Make the database available to the app
app.locals.db = db;

// Routes should be defined after successful DB connection

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

// Route for success page
app.get('/success', Controller.success);

// Route for login page 
app.get('/login', (req, res)=>{
    res.render('login')
})

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = app; // Export the app for testing or other modules