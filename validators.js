const isAlpha = (str) => /^[A-Za-z]+$/u.test(str);


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


module.exports = {
  isAlpha,
  isValidEmail
};