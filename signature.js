const SHA256 = require('crypto-js/sha256');
const secp = require("@noble/secp256k1");
const yargs = require('yargs');


// const argv = yargs
//     .option("privateKey", {
//         alias: "p",
//     })
//     .option("receipent", {
//         alias: "r",
//     })
//     .option("value", {
//         alias: "v",
//     })

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

const privateKey = "0025e83633e4cde1c14f918cd548f55d4b3bafc2ec4b77dd32dcc4ef0f4512f8";
const receipent = "04ab86fa20522095f6a5e3dc8d2e03a98bfe8af54cb7defa76b5b0d65fbc79b533c71d28f6356dc6ab86ff2e6b45a72546daa60fd52aa00e94dd5e630b438e53cb";
const value = 20;


generateSignature(privateKey, receipent, value);

