const { ethers} = require("ethers");
const bip39 = require('bip39');
let infuraProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/f99366737d854f5e91ab29dad087fcd5");
const axios = require('axios');

class etherWallet {
  createWallet = (req,res) =>{
    const mnemonic = bip39.generateMnemonic()
    console.log("mnemonic",mnemonic);
    var eth_wallet =  ethers.Wallet.fromMnemonic(mnemonic);
    var privateKey = eth_wallet.privateKey;
    var publicAddress = eth_wallet.address;
    console.log("mnemonic",eth_wallet,privateKey,publicAddress);
    return res.send({
     "mnemonic": mnemonic,privateKey,publicAddress
    })
}

fetchEthBal = (req,res)=>{
    var address = req.body.walletAddress;
    if(!address){
        return res.send({
            "message": "send wallet address"
           })
    }
    else {
        console.log("address----",address)
        infuraProvider.getBalance(address).then((balance) => {
           let etherfloat = parseFloat(ethers.utils.formatEther(balance));
           console.log("this.state.ethbal>>", etherfloat);
           return res.send({
            "balance": etherfloat
           })
       })
    }
}

sendEther = (req,res)=>{
    var addressFrom = req.body.from_address;
    var privateKeyFrom = req.body.from_privateKey;
    var addressTo = req.body.to_address;
    var Amt = req.body.Amount;
console.log("address from---",addressFrom,privateKeyFrom,addressTo,Amt);
axios({
    method: 'get',
    url: 'https://ethgasstation.info/json/ethgasAPI.json'
  })
    .then(function (response) {
      var gasPrice = response.data.fast;
      console.log("gas price----",gasPrice);

      var gas_price_ingwei = parseFloat(gasPrice) * Math.pow(10, 9);
      console.log("gas pric gwei",gas_price_ingwei);
      let wallet = new ethers.Wallet(privateKeyFrom, infuraProvider);
      wallet.sendTransaction({
        gasLimit: 21000,
        gasPrice: gas_price_ingwei,
        to: addressTo,
        value:  ethers.utils.parseEther(Amt)
    }).then((tx)=>{
        console.log("tx result----",tx);
        return res.send({
            "txn": tx
        })
    })

    });

  


  }
}

module.exports = new etherWallet()