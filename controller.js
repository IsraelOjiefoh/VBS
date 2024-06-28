const errors = []
exports.getRegister = (req, res) => {
    res.render('register', {errors});

};

exports.postRegister = (req, res) => {
  const { first_name, last_name, date_of_birth, email} = req.body;

  
 // Validate email format using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const UserEmail = req.body.email

  // Check for missing fields
  if (!first_name || !last_name || !date_of_birth || !email) {
    errors.push({msg: "Please fill all the fields"});
    return res.redirect('/register');
  }
  
  if(!emailRegex.test(UserEmail)){
     errors.push({msg:'Invalid Email Address Format'})
    if(errors.length > 0){
      res.render('register', {errors, first_name, last_name, date_of_birth, email} )
    }
    
  }else{
    res.send("Successful ")
  }

};