const dotenv = require('dotenv')

const express = require('express');
const bodyParser = require('body-parser');

const Controller = require('./controller');

dotenv.config()
const port = process.env.PORT ||3000;

const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.render('index'));

app.get('/register', Controller.getRegister);
app.post('/register', Controller.postRegister);

app.get('/success', (req, res) => res.render('success'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});