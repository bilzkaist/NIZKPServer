/**
 * Application Type: Model
 * Model Handler: Policies
 * Description: File handles all the Policies model (datastore and functions) for policies
 * 
 */


//  Base Dependencies
const base = require('./s3');
const { cloneDeep } = require('lodash');

// Validation Dependencies
const constraints = require('./../lib/constraints');
const format = require('./../lib/format');
const validate = require('validate.js')


// Create model to export to app
let _ = class extends base {

    // Load a policy, or create a new path with default values
    // Set Defaults using the parent base  class (models/s3.js)
    /**
     * constructor() function will set the default value by initiating the constructor inside of the base class (models/mongo.js) class 
     * 
     *      constructor() {
     *          this.created = Date.now()
     *          this._id = uuidv4();
     *      }
     * 
     * 
     */
    constructor(_id) {
        // Inherit all defaults using the parent base  class (models/s3.js) and use is as 'super' e.g super.load()
        super();
        // Set the specified _id
        let msg = validate.single(_id, constraints._id());
        // Check if validation return an error msg
        if(msg) {            
            this.err = msg;
        } else {            
            this._id = format._id(_id);
        }

        // Enf of  _.constructor
    }


    // Load this path from the "paths" table in dynamodb
    async load(loadContents = true) {
        await super.load('policies', loadContents);

        // Enf of  _.load()
    }

    // Get the record filtered by the role of the requester
    async getRecordByRole(role) {

        try {

            // Do a deep clone of the record
            let record = cloneDeep(this);

            // Delete properties based on the requester's role
            switch(role) {
                case 'public' :
                    delete record.internal;
                    delete record.jurisdiction;
                break
            }

            return record;

        } catch (err) {

            throw( new Error(err));
        }

        // Enf of  _.getRecordByRole() 
    }
   
    

    // Enf of  _ class
}






module.exports = _ ;