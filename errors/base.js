/**
 * Base for error classes 
 * 
 */

// Dependencies



// Create module to export
let _ = class {

    // Create the error object using a constrator
    constructor( type = null ) {

        this.error = {
            'type' : type,
            'timestamp' : Date.now()
        };
    }
};



// Export router module as _ to handle ping route and errors
module.exports = _;