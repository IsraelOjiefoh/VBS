const express = require ('express')

const router= express.Router()

const loginController = require('../controllers/login-controller')

const registerController = require('../controllers/register-controller')


router.get('/login', loginController.getLogin)

router.post('/login', loginController.postLogin)

router.get('/register', registerController.getRegister)

router.post('/register', registerController.postRegister);

// Confirmation email routes
router.get('/confirm-email', (req, res) => {
    res.render('confirm-email');
});

router.post('/confirm-email', registerController.postConfirmationEmail);


//successful authentication 
router.get('/success', registerController.success)

module.exports = router