/**
 * Application Type: Model
 * Model Handler: Email Tokens
 * Description: File handles all the email Tokens model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const base = require('./mongo');
const {cloneDeep} = require('lodash');

// Secrets Dependencies
const secretsLib = require('./../lib/secrets');

// Model Dependencies
const EmailAddress = require('./../models/emailAddresses');

// Validation Dependencies
const constraints = require('./../lib/constraints');
const format = require('./../lib/format');
const validate = require('validate.js')
const { v4: uuidv4 } = require('uuid');

// Create module to export
let _ = class extends base {

    // Load a user, or create a new user with default values
    // Set Defaults using the parent base  class (models/mongo.js)
    
     
    constructor(_id = false) {

        // Inherit all defaults using the parent base  class (models/mongo.js) and use is as 'super' e.g super.load()
        super();

        // If _id is set, set it on the object
        if(_id) {

            // Set the specified _id
            let msg = validate.single(_id, constraints._id());
            if(msg) {            
                this.err = msg;
            } else {            
                this._id = format.path(_id);
            }
        } else {
            // Now set the default verification data
            this.email = null;
            this.expires = Date.now() + 1000 * 60 * 15 // 15 Minutes
            this.emailExists = false;            
            this.internal = {}
        }
    }

    // Load this data from the  email verfication table on mongodb
    async load() {
        await super.load('emailToken');
    }

    // Save this data from the  email verfication table on mongodb
    async save() {
        await super.save('emailToken');
    }

    // Expire this object
    async expire() {
        this.expires = Date.now() - 1;
        await this.save();
    }

    // Set the email address
    async setEmailAddress(email) {

        try{

            // Get validation message(s), if any
            let msg = validate.single(email, constraints.emailAddress());

            // if validation passes, format the input accordingly
            if(msg) {
                return MSGesture;
            } else {
                this.email = format.emailAddress(email);
            }

            // Look up the email in the email table to see if it's taken
            let emailAddress = new EmailAddress(email);
            await emailAddress.load();
            if(!emailAddress.err) this.emailExists = true;

            return;


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
                case 'owner' :
                    delete record.internal;
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
