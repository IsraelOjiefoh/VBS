const User = require('../models/user');

exports.getTransferPage = async (req, res) => {
  try {
    const userId = req.session.user;
    if (!userId) {
      req.flash('error_msg', 'User not logged in. Please log in again.');
      return res.render('login', { error_msg: 'User not logged in. Please log in again.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      req.flash('error_msg', 'User not found. Please log in again.');
      return res.render('login', { error_msg: 'User not found. Please log in again.' });
    }

    res.render('transfer-money', { user, error_msg: req.flash('error_msg') });
  } catch (error) {
    console.error('Error fetching user details:', error);
    req.flash('error_msg', 'Failed to fetch user details. Please try again.');
    res.render('error', { error_msg: 'Failed to fetch user details. Please try again.' });
  }
};

exports.postTransferMoney = async (req, res) => {
  const { receiverAccount, amount } = req.body;
  const userId = req.session.user;

  if (!userId) {
    req.flash('error_msg', 'User not logged in. Please log in again.');
    return res.render('login', { error_msg: 'User not logged in. Please log in again.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error_msg', 'User not found. Please log in again.');
      return res.render('login', { error_msg: 'User not found. Please log in again.' });
    }

    const senderAccount = user.accountNumber;
    if (!senderAccount) {
      req.flash('error_msg', 'Sender account number not available.');
      return res.render('dashboard', { error_msg: 'Sender account number not available.' });
    }

    const transferAmount = Number(amount);
    if (user.balance < transferAmount) {
      req.flash('error_msg', 'Insufficient funds.');
      return res.render('transfer-money', { user, error_msg: 'Insufficient funds.' });
    }

    user.balance -= transferAmount;
    await user.save();

    const receiver = await User.findOne({ accountNumber: receiverAccount });
    if (!receiver) {
      req.flash('error_msg', 'Receiver account not found.');
      return res.render('transfer-money', { user, error_msg: 'Receiver account not found.' });
    }

    receiver.balance += transferAmount;
    await receiver.save();

    req.flash('success_msg', 'Funds transferred successfully.');
    res.render('dashboard', { user, success_msg: req.flash('success_msg') }); // Corrected: pass success_msg as an object
  } catch (error) {
    console.error('Error transferring funds:', error);
    req.flash('error_msg', 'Failed to transfer funds. Please try again.');
    res.render('transfer-money', { user, error_msg: 'Failed to transfer funds. Please try again.' });
  }
};