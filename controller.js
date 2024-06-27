exports.getRegister = (req, res) => {
  const error_msg = req.flash('error_msg');
  if (error_msg.length > 0) {
    res.render('register', { error_msg });
  } else {
    res.render('register', { error_msg: null });
  }
};

exports.postRegister = (req, res) => {
  const { first_name, last_name, date_of_birth, pin } = req.body;

  // Check for missing fields
  if (!first_name || !last_name || !date_of_birth || !pin) {
    req.flash('error_msg', "Please fill all the fields");
    return res.redirect('/register');
  }

  // Check if the PIN is exactly 4 digits
  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    req.flash('error_msg', "Pin must be exactly 4 digits");
    return res.redirect('/register');
  }

  // If all checks pass, render the success page
  req.flash('success_msg', "Registration successful");
  res.render('success',{first_name, last_name,date_of_birth,pin});
};