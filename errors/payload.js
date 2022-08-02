/**
 * Application Type: Errors
 * Library Handler: Payload Errors
 * Description: File handles payload errors
 * 
 */

//  Dependencies
const base = require('./base');

// Create module to export
let _ = class extends base {

    // Create the error object using a constrator
    constructor( key = null, msg = null ) {

        // Set the type of error
        super('payload');

        // Set the value
        this.error.message = msg;
        this.error.key = key
    }
};


module.exports = _;