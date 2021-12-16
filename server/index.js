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
  [publicKey1]: 100,
  [publicKey2]: 75,
  [publicKey3]: 50,
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {signature, recovery, recipient, amount} = req.body;

  const message = JSON.stringify({
    to: recipient,
    amount: parseInt(amount),
  })

  const messageHash = SHA256(message).toString();

  const recoveredPublicKey = secp.recoverPublicKey(messageHash, signature, parseInt(recovery));

  const isSigned = secp.verify(signature, messageHash, recoveredPublicKey);

  if (isSigned){

    balances[recoveredPublicKey] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender] });
    logBalances();
  }
  else{
    console.error("Transaction Error: Signature does not match")
    logBalances()
  }

  
});

function logBalances() {
  console.log();
  console.log("================================== ACCOUNTS ==================================");
  console.log();
  console.log("Public Key #1: " + publicKey1 + " has a balance of " + balances[publicKey1]);
  console.log("Acct #1 Private Key: " + privateKey1);
  console.log();
  console.log("Public Key #2: " + publicKey2 + " has a balance of " + balances[publicKey2]);
  console.log("Acct #2 Private Key: " + privateKey2);
  console.log();
  console.log("Public Key #3: " + publicKey3 + " has a balance of " + balances[publicKey3]);
  console.log("Acct #3 Private Key: " + privateKey3);
  console.log();
  console.log("==============================================================================");
}

app.listen(port, () => {
  logBalances()
  console.log(`Listening on port ${port}!`);
});
