 /**
 * Application Type: Router
 * Route Handler: Paths
 * Description: Paths Handler, useable on the router in place to give ping request anwser
 * 
 */

// Dependencies
const Path = require('./../models/paths');
const PayloadError = require('./../errors/payload');
const RequestError = require('./../errors/request');
const QueryError = require('./../errors/query');
const { get }   =   require('lodash');


// Create module to export
let _ = {};

_.get = async (req, res) => {

    try {

        // Defaults for the validation process
        let key = false;
        let msg = false;

        
        // Instantiate a new new based onn the string requested
        key = '_id';
        
        let path = new Path(get(req.query, key));
        
        if(path.err) { return res.status(400).json(new QueryError(key, path.err));}

        // Sync the object with the data from the database
        await path.load();
        
        if(path.err) { return res.status(404).json(new RequestError(404));}


        // Retrieve the data for it, filtered by what should be visible to the public
        let record = await path.getRecordByRole('public');

        // Return the filtered data
        res.json(record)



    } catch (err) {
        res.sendStatus(500).end();
    }
}







// Export router module as _ to handle paths route and errors
module.exports = _;