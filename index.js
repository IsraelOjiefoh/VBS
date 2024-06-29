const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { MongoClient } = require('mongodb');
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

// MongoDB connection setup
const uri = process.env.URI;
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        app.locals.db = client.db('mydatabase'); // Make the database available to the app

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

        app.get('/thank-you', (req, res) => {
    res.render('thank-you'); 
});
        // Start the server and listen on the specified port
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with failure
    }
}

// Call the function to connect to MongoDB
connectToMongoDB();