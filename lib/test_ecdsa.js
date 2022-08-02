var ellipticcurve = require("starkbank-ecdsa");
var Ecdsa = ellipticcurve.Ecdsa;
var PrivateKey = ellipticcurve.PrivateKey;

// Generate privateKey from PEM string

//  Dependencies
// const MongoClient = require('mongodb').MongoClient;
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const secretsLib = require('./secrets');


// Create module to export 
let _ = {};



_.generatePrivateKey = async (secrets) => {
     var privateKey = PrivateKey.fromPem("-----BEGIN EC PARAMETERS-----\nBgUrgQQACg==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIODvZuS34wFbt0X53+P5EnSj6tMjfVK01dD1dgDH02RzoAcGBSuBBAAK\noUQDQgAE/nvHu/SQQaos9TUljQsUuKI15Zr5SabPrbwtbfT/408rkVVzq8vAisbB\nRmpeRREXj5aog/Mq8RrdYy75W9q/Ig==\n-----END EC PRIVATE KEY-----\n");
}

_.generateMessageFromJson = async (json) => {
     // Create message from json
     let message = JSON.stringify({
          "transfers": [
          {
               "amount": 100000000,
               "taxId": "594.739.480-42",
               "name": "Daenerys Targaryen Stormborn",
               "bankCode": "341",
               "branchCode": "2201",
               "accountNumber": "76543-8",
               "tags": ["daenerys", "targaryen", "transfer-1-external-id"]
          }
          ]
     });
     return message
}



_.signature = Ecdsa.sign(message, privateKey);
_.signature.toBase64()
// Generate Signature in base64. This result can be sent to Stark Bank in header as Digital-Signature parameter


// To double check if message matches the signature
_.publicKey = privateKey.publicKey();

_.Ecdsa.verify(message, signature, publicKey);


module.exports = _;