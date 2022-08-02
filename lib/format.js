/**
 * Application Type: Library
 * Library Handler: Validation Format
 * Description: File handles validation formats
 * 
 */

//  Dependencies

// Create module to export
let _ = {};

// Names
_.name = (str) => {

    // trim it
    str = str.trim();

    // Replace multiple whitespaces with single space
    str = str.replace(/ +/g, ' ');

    let lwr = str.toLowerCase();
    

    return str;
}

// Paths
_.path = (str) => {

    // trim it
    let lwr = str.toLowerCase();    

    return str;
}

// Handle
_.handle = (str) => {

    // @TODO / OPTIONAL if we want to add formatting later, it would go here
    

    return str;
}

// RefId
_.refId = (str) => {

    // @TODO / OPTIONAL if we want to add formatting later, it would go here
    

    return str;
}

// RefType
_.refType = (str) => {

    // @TODO / OPTIONAL if we want to add formatting later, it would go here
    

    return str;
}

_._id = (_id) => {

    // @TODO / OPTIONAL if we want to add formatting later, it would go here
    

    return _id;
}

_.policyVersion = (policyVersion) => {

    // @TODO / OPTIONAL if we want to add formatting later, it would go here
    

    return policyVersion;
}

_.emailAddress = (email) => {
    // @TODO / OPTIONAL if we want to add formatting later, it would go here


    return email;
}

module.exports = _;