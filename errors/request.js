/**
 * Request Errors file
 * 
 */

// Dependencies
const base = require('./base');


// Create module to export
let _ = class extends base {

    // Create the error object using a constrator
    constructor( code = null ) {

        // Set the type of error -> This "request" is added in the parent class './base' as value of property 'type' 
        super('request');

        // Set the value other then mentioned in parent class
        this.error.code = code
    }
};



// Export router module as _ to handle ping route and errors
module.exports = _;