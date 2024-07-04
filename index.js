const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const session = require('express-session');

const flash = require('connect-flash');

const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth')

const userRoute = require('./routes/userRoute')

const bankingRoute = require('./routes/banking')

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

    res.locals.message = req.flash('message');

    res.locals.success_msg = req.flash('success_msg');
    
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

// authentication Routes
app.use('/auth', authRoutes)

// user Routes
app.use('/user', userRoute)

// banking Routes
app.use('/banking', bankingRoute)

// Home page route
app.get('/', (req, res) => {
    res.render('index');
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