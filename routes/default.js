/**
 * Application Type: Router
 * Route Handler: Default
 * Description: Default Handler, useable on the router in place of actual routes
 * 
 */


// Dependencies
const ResquestError = require('./../errors/request');


// Create module to export
let _ = {};

// Method Not Allowed
_._405 = async (req, res) => {
    let code = 405;
    return res.status(code).json(new ResquestError(code));
};



// Not Found Error
_._404 = async (req, res) => {
    let code = 404;
    return res.status(code).json(new ResquestError(code));
};


// Export router module as _ to handle default route and errors
module.exports = _;