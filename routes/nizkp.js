 /**
 * Application Type: Router
 * Route Handler: Ping
 * Description: Ping Handler, useable on the router in place to give ping request anwser
 * 
 */

// Bilal Dastagir

// Dependencies
// Process Dependencies
const PayloadError = require('./../errors/payload');
const RequestError = require('./../errors/request');
const { get } = require('lodash');

const Nizkp = require('./../models/nizkp');
// Create module to export
let _ = {};



// Get Request to /ping route
_.verify = async (req, res, next) => {
    let nizkp = new Nizkp();
    console.log(req.params)
    // pub
    // msg
    // sig
    nizkp.setPublicKey(decodeURI(req.params.pub));
    nizkp.setSig(decodeURI(req.params.sig));
    nizkp.setMsg(decodeURI(req.params.msg));
    nizkp.verifyEscada();

    console.log("Starting Verification Request ......");
    let verificationStatus = nizkp.verification;
    console.log(verificationStatus)
    


    console.log('Time:', Date.now())
    let code = 200;
    if (verificationStatus) {
        res.json({
            'ping' : 'successful',
            'status' : code,
            'verification': 'successfully verified',
            'timestamp' : Date.now(),
            'message': "Hello, I am alive.", 
            'request': req.params,
            'public_key': nizkp.publicKey,
            'message': nizkp.msg,
            'signature': nizkp.sig
            
        });
        return res.status(code).json();
    } else {
        res.json({
            'ping' : 'successful',
            'status' : code,
            'verification': 'Failed',
            'timestamp' : Date.now(),
            'message': "Verification failed.", 
            'request': req.params      
        });
        return res.status(code).json();
    }
    
    // return res.status(code).json();
};

// _.post = async (req, res) => {

// }

// _.all = async (req, res) => {   
//     let code = 200;
//     res.json({
//         'ping' : 'successful',
//         'status' : code,
//         'timestamp' : Date.now(),
//         'message': "I am alive"
//     });
//     return res.status(code).json(new ResquestError(code));
// }


// Export router module as _ to handle ping route and errors
module.exports = _;

