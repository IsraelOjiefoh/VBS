const express = require('express');

const router = express.Router();

const bankingController = require('../controllers/bankingController');

router.get('/transfer-money', bankingController.getTransferPage);

router.post('/transfer-money', bankingController.postTransferMoney);

module.exports = router;