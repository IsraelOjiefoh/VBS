const dotenv = require('dotenv')
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const Controller = require('./controller');

dotenv.config()
const port = process.env.PORT ||3000;

const app = express();

app.set("view engine", 'ejs');

// Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.get('/', (req, res) => res.render('index'));

app.get('/register', Controller.getRegister);
app.post('/register', Controller.postRegister);

app.get('/success', (req, res) => res.render('success'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});