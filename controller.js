const { isAlpha } = require('./validators');

const renderWithErrors = (req, res, errors, data) => {
  res.render('register', { errors, ...data });
};

exports.getRegister = (req, res) => {
  res.render('register', { errors: [], first_name: '', last_name: '', date_of_birth: '', email: '' });
};

exports.postRegister = (req, res) => {
  const { first_name, last_name, date_of_birth, email } = req.body;
  let errors = [];

  // Validate email format using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check for missing fields
  if (!first_name || !last_name || !date_of_birth || !email) {
    errors.push({ msg: "Please fill all the fields" });
     renderWithErrors(req, res, errors, { first_name, last_name, date_of_birth, email });
  }

  // Validate first name
  if (!isAlpha(first_name)) {
    errors.push({ msg: "First Name should contain only letters" });
  }
  if (first_name.length < 2 || first_name.length > 20) {
    errors.push({ msg: "First Name must be between 2 and 20 letters" });
  }

  // Validate last name
  if (!isAlpha(last_name)) {
    errors.push({ msg: "Last Name should contain only letters" });
  }

  
  if (last_name.length < 2 || last_name.length > 30) {
    errors.push({ msg: "Last Name must be between 2 and 30 letters" });
  }

  // Validate email
  if (!emailRegex.test(email)) {
    errors.push({ msg: "Invalid Email Address Format" });
  }

  // Render errors or success message
  if (errors.length > 0) {
     renderWithErrors(req, res, errors, { first_name, last_name, date_of_birth, email });
  }else{
    res.send("Successful ")
  }
}