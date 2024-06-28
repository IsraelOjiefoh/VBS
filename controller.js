const { isAlpha,
       isValidEmail } = require("./validators");

const renderWithErrors = (req, res, errors, data) => {
  res.render("register", { errors, ...data });
};

exports.getRegister = (req, res) => {
  res.render("register", {
    errors: [],
    first_name: "",
    last_name: "",
    email: "",
  });
};

exports.postRegister = (req, res) => {
  const { first_name, last_name, is_over_18, email } = req.body;
  let errors = [];

  // Check for missing fields
  if (!first_name || !last_name || !is_over_18 || !email) {
    errors.push({ msg: "Please fill all the fields" });

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
  if (!isValidEmail(email)) {
    errors.push({ msg: "Invalid Email Address Format" });
  }

  // Render errors or success message
  if (errors.length > 0) {
    renderWithErrors(req, res, errors, {
      first_name,
      last_name,
      is_over_18,
      email,
    });
  } 
  // Check if the user confirmed they are 18 or older
  if (!is_over_18) {
    errors.push({ msg: 'You must confirm that you are 18 years or older' });
    renderWithErrors(req, res, errors, {
      first_name,
      last_name,
      is_over_18,
      email,
    });
  
  }
    

    
  else {
    res.send("Successful ");
  }
};
