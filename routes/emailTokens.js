 /**
 * Application Type: Router
 * Route Handler: Paths
 * Description: Paths Handler, useable on the router in place to give ping request anwser
 * 
 */

// Dependencies
const EmailTokenn = require('./../models/emailTokens');
const EmailVerification = require('./../models/emailVerifications')
const PayloadError = require('./../errors/payload');
const RequestError = require('./../errors/request');
const QueryError = require('./../errors/query');
const { get }   =   require('lodash');





// Create module to export
let _ = {};


// POST Request
_.post = async (req, res) => {

    try {

        // Instantiate a new mail verification through model/emailVerification a new object
        // let verification = new EmailVerification();

        // Default for the validation process
        let msg = false;
        let key = false;
        // Lookup the verification, create new verification object
        key = 'verification._id';
        let verification = new EmailVerification(get(req.body, key));
        if(verification.err) return res.status(400).json(new PayloadError(key, verification.err));

        // Sync verification data with data from the database
        await verification.load();
        if(verification.err) return res.status(400).json(new PayloadError(key, verification.err));

        // Check to see if expired
        msg = ['Token must not be expired'];
        if( verification.expires < Date.now() ) return res.status(400).json(new PayloadError(key, msg));

        // Increased attempts
        msg = ['Token verification has exceeded the max number of attempts'];
        if(verification.attempts.max <= verification.attempts.made) return res.status(400).json(new PayloadError(key, msg));

        await verification.incrementAttempts();

        // Check to see the code matches what was sent
        key = 'verification.code';
        msg = ['incorrect'];
        if(verification.code !== get(req.body, key)) return res.status(400).json(new PayloadError(key, msg));

        // Create new token
        let token = new EmailTokenn();

        // Set the email address on the token
        await token.setEmailAddress(verification.email);

        // Save the token
        await token.save();

        // Delete the verification object
        await verification.expire();

        // Retrive the data for it, filtered by what should be visible to the owner of the record
        let record = await token.getRecordbyRole('owner');

        // Return the filtered data
        res.json(record);

        
    } catch (err) {
        // throw( new Error(err))
        res.status(500).end();
    }
}



// Export router module as _ to handle paths route and errors
module.exports = _;