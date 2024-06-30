//function to check if input contains alphabet only
const isAlpha = (str) => /^[A-Za-z]+$/u.test(str);


//function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports ={
  isAlpha,
  isValidEmail
}