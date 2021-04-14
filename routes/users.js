var express = require('express');
var etherWallet = require('../api/wallet');
var router = express.Router();


/* GET users listing. */
router.get('/createWallet', etherWallet.createWallet);

router.post('/fetchBalance', etherWallet.fetchEthBal);

router.post('/sendEth', etherWallet.sendEther);


module.exports = router;
