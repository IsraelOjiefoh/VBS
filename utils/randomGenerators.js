// Function to generate a random 6-digit confirmation code
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


//Function to generate a random 10-digit account number 
function generateAccountNumber() {
  let accountNumber = '';
  for (let i = 0; i < 10; i++) {
    accountNumber += Math.floor(Math.random() * 10).toString();
  }
  return accountNumber;
}


//Function to generate a random 6-digit PIN
function generatePin() {
  let pin = '';
  for (let i = 0; i < 6; i++) {
    pin += Math.floor(Math.random() * 10).toString();
  }
  return pin;
}


module.exports = {
  generateConfirmationCode,
  generateAccountNumber,
  generatePin
};