 /**
 * Application Type: Router
 * Route Handler: Policies
 * Description: Policies Handler, useable on the router in place to give policies to the user
 * 
 */

// Dependencies
const Policy = require('./../models/policies');
const PayloadError = require('./../errors/payload');
const RequestError = require('./../errors/request');
const QueryError = require('./../errors/query');
const { get }   =   require('lodash');


// Create module to export
let _ = {};

_.get = async (req, res) => {

    try {
        
        // Test Identifier string to be used only for testing 
        // if (req.query.test != '' && req.query.test != undefined){
        //     let test = req.query.test;  
        //     if (test.check) {                         
        //         // console.log('Test Identifier - Page: /routes/policies.js - Line: 25 - Test Method: '+ test.method + ' Test no ' + test.no  )
        //     } 
        // }
        

        // Defaults for the validation process
        let key = false;
        let msg = false;

        
        // Instantiate a new new based onn the string requested
        key = '_id';
        
        
        let policy = new Policy(get(req.query, key));
        if(policy.err) { return res.status(400).json(new QueryError(key, policy.err));}

        // Sync the object with the data from the database
        await policy.load();
        if(policy.err) { return res.status(404).json(new RequestError(404));}


        // Retrieve the data for it, filtered by what should be visible to the public
        let record = await policy.getRecordByRole('public');

        // Return the filtered data
        res.json(record)



    } catch (err) {
        // console.log(err)
        res.sendStatus(500).end();
    }
}







// Export router module as _ to handle paths route and errors
module.exports = _;