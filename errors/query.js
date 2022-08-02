/**
 * Query Errors file
 * 
 */

// Dependencies
const base = require('./base');


// Create module to export
let _ = class extends base {

    // Create the error object using a constrator
    constructor( key = null, path = null ) {

        // Set the type of error
        super('query');

        // Set the value
        this.error.message = path;
        
        this.error.key = key
    }
};



// Export router module as _ to handle ping route and errors
module.exports = _;