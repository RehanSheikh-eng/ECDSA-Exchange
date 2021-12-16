const SHA256 = require('crypto-js/sha256');
const secp = require("@noble/secp256k1");

async function generateSignature(privateKey, receipent, value){

    // Generate message JSON object
    const message = JSON.stringify({
        to: receipent,
        amount: value,
    });

    // Generate message hash wiht SHA256 hashing algo
    const messageHash = SHA256(message).toString();

    const signatureArray = await secp.sign(messageHash, privateKey, {
        recovered: true
      });

    const signature = signatureArray[0];
    const recoveryBit = signatureArray[1];

    console.log("Signature: " + signature);
    console.log("Recovery bit: " + recoveryBit);
}