/**
 * Application Type: Model
 * Model Handler: Email Addresses
 * Description: File handles all the email addresses model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const base = require('./dynamo');
const {cloneDeep} = require('lodash');

// Model Dependencies
// const Policy = require('./policies');

// Validation Dependencies
const constraints = require('./../lib/constraints');
const format = require('./../lib/format');
const validate = require('validate.js')


// Create a module to export
let _ = class extends base {

    // Load a user, or create a new user with default values
    // Set Defaults using the parent base  class (models/mongo.js)
    
     
    constructor(_id) {

        // Inherit all defaults using the parent base  class (models/mongo.js) and use is as 'super' e.g super.load()
        super();
        // Set the specified _id
        let msg = validate.single(_id, constraints.emailAddress());

        if(msg) {            
            this.err = msg;
        } else {            
            this._id = format.emailAddress(_id);
        }        
    }

    // Load this path from the "paths" table in dynamodb
    async load() {
        await super.load('emailAddresses'); 
    }

    // Save this path to the "paths" table in the dynamodb
    async save(doNotUpdate = false) {
        await super.save('emailAddresses', doNotUpdate);
    }

    // Set the refType
    async setRefType(refType) {

        try {

            // Get validation message(s), if any
            let msg = validate.single(refType, constraints.refType());

            // If Validation passes, format the input accordingly
            if(!msg) this.refType = format.refType(refType);

            return msg;


        } catch (err) {

            throw(new Error(err));

        }
    }

    // Set the refId
    async setRefId(refId) {

        try {

            // Get validation message(s), if any
            let msg = validate.single(refId, constraints.refId());

            // If Validation passes, format the input accordingly
            if(!msg) this.refId = format.refId(refId);

            return msg;


        } catch (err) {
            
            throw(new Error(err));

        }
    }


    // Get the record filtered by the role of the requester
    async getRecordByRole(role) {

        try {

            // Do a deep clone of the record
            let record = cloneDeep(this);

            // Delete properties based on the requester's role
            switch(role) {
                case 'public' :
                    delete record.created;
                    delete record.updated;
                break
            }

            return record;

        } catch (err) {

            throw( new Error(err));
        }
    }
}








// Export router module as _ to handle paths route and errors
module.exports = _;