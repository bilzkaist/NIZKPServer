 /**
 * Application Type: Router
 * Route Handler: TOTP Keys
 * Description: TOTP Keys Handler, useable on the router in place to give ping request anwser
 * 
 */

// Dependencies
const TotpKey = require('./../models/totpKeys');

const PayloadError  = require('./../errors/payload');
const RequestError  = require('./../errors/request');
const QueryError    = require('./../errors/query');
const { get }       = require('lodash');





// Create module to export
let _ = {};


// POST Request
_.post = async (req, res) => {

    try {
        
        // Instantiate a new TOTP Key through model/totpKeys a new object
        let totp = new TotpKey();

        // Add the QR Code
        await TotpKey.generateQRCode();

        // Save the QR Code object
        await TotpKey.save();

        // Retrieve the data for it, filtered by what should be visible to the owner of the record
        let record = await verification.getRecordByRole('owner');

        // Return filtered data
        res.json(record);

    } catch (err) {
        console.log(err);
        // throw( new Error(err))
        res.status(500).end();
    }
}



// Export router module as _ to handle paths route and errors
module.exports = _;