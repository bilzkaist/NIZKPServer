/**
 * General purpose utilities
 */

 let _ = {};

//  Parses a json string into a json object
// Get an object from JSON, without throwing

_.getObjectFromJson = (str) => {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch {
        return false;
    }
};








 // Export all (_) as a module
 module.exports = _;