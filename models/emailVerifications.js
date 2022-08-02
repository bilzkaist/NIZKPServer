/**
 * Application Type: Model
 * Model Handler: Email Verification
 * Description: File handles all the Email Verification model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const base = require('./mongo');
const {cloneDeep} = require('lodash');

// Secrets Dependencies
const secretsLib = require('./../lib/secrets');

// Model Dependencies
// const Policy = require('./policies');

// Validation Dependencies
const constraints = require('./../lib/constraints');
const format = require('./../lib/format');
const validate = require('validate.js');
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
            this.code = uuidv4().toLowerCase().substring(0,8);
            this.expires = Date.now() + 1000 * 60 * 15 // 15 Minutes
            this.attempts = {
                'max' : 4,
                'made' : 0
            };
            this.internal = {}
        }
    }

    // Load this data from the  email verfication table on mongodb
    async load() {
        await super.load('emailVerifications');
    }

    // Save this data from the  email verfication table on mongodb
    async save() {
        await super.save('emailVerifications');
    }

    // Incremeent the attempt counter
    async incrementAttempt() {
        this.attempts.made++
        await this.save();
    }

    // Expire this object
    async expire() {
        this.expires = Date.now() - 1;
        await this.save();
    }

    // Set the email address
    async setEmailAddress(email) {
        try {
            
            // Get validation message
            let msg = validate.single(email, constraints.emailAddress());

            // if validation passes, format the input accordingly
            if(msg) {
                return msg;
            } else {
                this.email = format.emailAddress(email)
            }

            // Check if email address is valid
            return new Promise( (resolve, reject) => {

                // Require Mailgun Lib and also pass the API 
                const mailgun = require('mailgun-js')({
                    apiKey: secretsLib.secrets.mailgun.privateKey,
                    domain: secretsLib.secrets.mailgun.domain
                });


                mailgun.validate(email, true, (err, body) => {
                    // Check for errors
                    if(err) resolve([err.message]);

                    // Check if it is a disposable email address or not
                    if(body.is_disposable_address) {
                        resolve(['Must not be a disposable email address']);
                    }

                    // Check if it is a role based email address
                    if(body.is_role_address) {
                        resolve(['Must not be a role-based email address']);
                    }

                    // Check if body is invalid
                    if(!body.is_valid) {
                        resolve(['Must be a email address, check what you typed']);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (err) {

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
                    delete record.code;
                    delete record.attempts;
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

