 /**
 * Application Type: Router
 * Route Handler: Paths
 * Description: Paths Handler, useable on the router in place to give ping request anwser
 * 
 */

// Dependencies
const TotpToken = require('./../models/totpTokens');

const PayloadError  = require('./../errors/payload');
const RequestError  = require('./../errors/request');
const QueryError    = require('./../errors/query');
const { get }       = require('lodash');





// Create module to export
let _ = {};


// POST Request
_.post = async (req, res) => {

    try {
        
        // Instantiate a new mail verification through model/emailVerification a new object
        let verification = new EmailVerification();

        // Default for the validation process
        let msg = false;
        let key = false;

        // Set the email address and validate 
        key = 'email';
        msg = await verification.setEmailAddress(get(req.body, key));
        if(msg) return res.status(400).json(new PayloadError(key, msg));

        // Save the object
        await verification.save();

        // Create a new outbound email
        let email = new Email();

        // Set the "to" address
        await email.setTo(verification.email);
        if(msg) return res.status(500);

        
        // Set the subject and body of the email
        await email.setContent( 'emailVerification', {'verification': verification });
        if(msg) return res.status(500);

        // Actually send the email (temporary)
        await email.queue();
        // Retrieve the data for it, filtered by what should be visible to the owner of the record
        let record = await verification.getRecordByRole('owner');

        // Return filtered data
        res.json(record);

    } catch (err) {
        // throw( new Error(err))
        res.status(500).end();
    }
}



// Export router module as _ to handle paths route and errors
module.exports = _;