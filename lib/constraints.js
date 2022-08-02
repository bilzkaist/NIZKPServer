/**
 * Application Type: Library
 * Library Handler: Validation Constraints
 * Description: File handles validation constraints
 * 
 */

//  Dependencies

// Create module to export
let _ = {};

// Names
_.name = () => {

    // Set the regex
    let regex = "[\-\'\A-Za-z0-9 ]+";

    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'format' : {
            'pattern' : regex,
            'flags' : 'i',
            'message' : 'name must match the following pattern: ' + regex
        }
    };

    return constraints;
}

// Paths
_.path = () => {

    // Set the regex
    let regex = "[\-\A-Za-z0-9]+";


    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'format' : {
            'pattern' : regex,
            'flags' : 'i',
            'message' : 'path must match the following pattern: ' + regex
        }
    };

    return constraints;

}
// Names
_.handle = () => {

    // Set the regex
    let regex = "[\-\A-Za-z0-9]+";

    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'length' : {
            'minimum' : 3,
            'maximum' : 30
        },
        'format' : {
            'pattern' : regex,
            'flags' : 'i',
            'message' : 'handle must match  the following pattern: ' + regex
        }
    };

    return constraints;
}

// RefTypes
_.refType = () => {

    // Set the regex
    let regex = "[\-\A-Za-z0-9]+";

    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'format' : {
            'pattern' : regex,
            'flags' : 'i',
            'message' : 'must match the following pattern: ' + regex
        }
    };

    return constraints;
}


// RefId
_.refId = () => {

    // Set the regex
    let regex = "[\-\A-Za-z0-9]+";

    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'format' : {
            'pattern' : regex,
            'flags' : 'i',
            'message' : 'must match the following pattern: ' + regex
        }
    };

    return constraints;
}

// _id
_._id = () => {

    // Set the regex
    let regex = "[\-\A-Za-z0-9]+";

    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'format' : {
            'pattern' : regex,
            'flags' : 'i',
            'message' : 'must match the following pattern: ' + regex
        }
    };

    return constraints;
}

// policy version
_.policyVersion = (name = '', policyVersion='') => {

    // Set the regex
    let regex = "[\-\.\_\*\A-Za-z0-9]+";

    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'format' : {
            'pattern' : regex,
            'flags' : 'i',
            'message' : name + ' : ' + policyVersion + ' : ' + 'must match the following pattern: ' + regex
        }
    };

    return constraints;
}

// Email Address
_.emailAddress = () => {

    // Create the constraints
    // Create the Constraints
    let constraints = {
        'presence' : { 'allowEmpty' : false},
        'type' : 'string',
        'email' : true
    };

    return constraints;
}


module.exports = _;