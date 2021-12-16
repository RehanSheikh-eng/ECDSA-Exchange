const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const SHA256 = require('crypto-js/sha256');
const secp = require("@noble/secp256k1");

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// Generate Private keys for 3 users
let privateKey1 = secp.utils.randomPrivateKey();
let privateKey2 = secp.utils.randomPrivateKey();
let privateKey3 = secp.utils.randomPrivateKey();

// Convert keys to hex strings
privateKey1 = Buffer.from(privateKey1).toString('hex');
privateKey2 = Buffer.from(privateKey2).toString('hex');
privateKey3 = Buffer.from(privateKey3).toString('hex');

const privateKeys = [privateKey1, privateKey2, privateKey3];

// Get public key from private key
const publicKey1 = secp.getPublicKey(privateKey1);
const publicKey2 = secp.getPublicKey(privateKey2);
const publicKey3 = secp.getPublicKey(privateKey3);

let balances = {
  publicKey1: 100,
  publicKey2: 75,
  publicKey3: 50,
}

for (let i = 0; i < Object.keys(balances).length; i++){
  console.log(`Account ${i}: \nADDRESS: ${Object.keys(balances)[i]} \nPrivate Key:${privateKeys[i]}`);
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
