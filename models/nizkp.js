/**
 * Application Type: Model
 * Model Handler: Users
 * Description: File handles all the user model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const base = require('./mongo');
const {cloneDeep} = require('lodash');

// Security Dependencies
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcryptjs');
// Model Dependencies
const Policy = require('./policies');


// Validation Dependencies
const constraints = require('./../lib/constraints');
const format = require('./../lib/format');
const validate = require('validate.js');


// EECDSA Dependencies 
const ellipticcurve = require("starkbank-ecdsa");
var Ecdsa = ellipticcurve.Ecdsa;
var PrivateKey = ellipticcurve.PrivateKey;
// Generate privateKey from PEM string
//var privateKey = PrivateKey.fromPem("-----BEGIN EC PARAMETERS-----\nBgUrgQQACg==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIODvZuS34wFbt0X53+P5EnSj6tMjfVK01dD1dgDH02RzoAcGBSuBBAAK\noUQDQgAE/nvHu/SQQaos9TUljQsUuKI15Zr5SabPrbwtbfT/408rkVVzq8vAisbB\nRmpeRREXj5aog/Mq8RrdYy75W9q/Ig==\n-----END EC PRIVATE KEY-----\n");
// Generate privateKey from PEM string
var privateKeyProver = PrivateKey.fromPem("-----BEGIN EC PARAMETERS-----\nBgUrgQQACg==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIODvZuS34wFbt0X53+P5EnSj6tMjfVK01dD1dgDH02RzoAcGBSuBBAAK\noUQDQgAE/nvHu/SQQaos9TUljQsUuKI15Zr5SabPrbwtbfT/408rkVVzq8vAisbB\nRmpeRREXj5aog/Mq8RrdYy75W9q/Ig==\n-----END EC PRIVATE KEY-----\n");
// Generate privateKey from PEM string
var privateKey = PrivateKey.fromPem("-----BEGIN EC PARAMETERS-----\nBgUrgQQACg==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMF8CAQEEC2Qt/nu////9ffdJoAcGBSuBBAAKoUQDQgAEp9nrFCWyo0tsn7NfxY7/\nMsIhhgTBn6WdAh80TiGFsp9RDGWgr7cu7L6KYcOOaCGqA6Dlb1jakAGU3QA26tyd\nxw==\n-----END EC PRIVATE KEY-----\n");


// For  elliptic curve usages
var Signature = ellipticcurve.Signature;
var PublicKey = ellipticcurve.PublicKey;
// Other Deependencies
const moment = require('moment');

const { v4: uuidv4 } = require('uuid');


// Create model to export to app
let _ = class extends base{

    // Load a user, or create a new user with default values
    // Set Defaults using the parent base  class (models/mongo.js)
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
    constructor(userId = false) {

        // If a userId is set, load the userData from the DB
        if(userId) {
            // @TODO 
        } else {

            // Inherit all defaults using the parent base  class (models/mongo.js) and use is as 'super' e.g super.save()
            super();
            this.created = Date.now()
            this._id = uuidv4();
            // Now set the default user data
            this.verified = false;
            this.activated = false;
            this.banned = false;
            this.name = {
                'first' : null,
                'last' : null
            };
            this.email = null;
            this.tags = [];
            this.notes = {
                'admin' : [],
                'cs' : []
            };
            this.corporate = false;
            this.regulator = false;
            this.internal = false;
            
            this.policies = {
                'terms' : null,
                'privacy': null,
                'phone-verification': null,
                'email-marketing': null
            }
            this.security = {
                'passwordHas' : null,
                'totp': null,
                'phone': null
            }

            this.dob = {
                'month': null,
                'day': null,
                'year': null
            }

            this.internal = {};
            this.publicKey = null;
            this.msg = null;
            this.sig = null;
            this.verification = false;
        }
    }


    // Save this user to the "users" collection
    async save() {
        await super.save('users');
    }

    async verifyEscada() {
       //
    
       var publicKeyRemote = PublicKey.fromPem(this.publicKey);
       console.log("Public Key Received Successul!!!");
       console.log("Public Key Remote : ", publicKeyRemote.toPem());
       console.log("EC Parameters : ", privateKey.toPem());
       let publicKey = privateKeyProver.publicKey(); //.PublicKey();
       console.log("Public Key Server : ", publicKey.toPem());
       let msg = this.msg;
       console.log("Message Received : ", msg);
       //let sig = Signature.fromDem(this.sig);
       let signatureRemote = Signature.fromBase64(this.sig);
       //console.log("Digital Signature Received : ", signatureRemote);
       this.verification =  Ecdsa.verify(msg, signatureRemote, publicKeyRemote);
        
        
    }
    // Set the first name
    async setPublicKey(pub) {

        try {

            // Get the validation message, if any
            // let msg = validate.single(firstname, constraints.name());

            // if the validation passes, format the input accordingly
            this.publicKey = pub;

            // return msg;

        } catch (err) {
            throw( new Error(err));
        }
    }

    // Set the first name
    async setMsg(msg) {

        try {

            // Get the validation message, if any
            // let msg = validate.single(firstname, constraints.name());

            // if the validation passes, format the input accordingly
            this.msg = msg;

            // return msg;

        } catch (err) {
            throw( new Error(err));
        }
    }

    // Set the first name
    async setSig(sig) {

        try {

            // Get the validation message, if any
            // let msg = validate.single(firstname, constraints.name());

            // if the validation passes, format the input accordingly
            this.sig = sig;

            // return msg;

        } catch (err) {
            throw( new Error(err));
        }
    }

    // async setPrivateFromPublic(pub, msg, )
    // Set the first name
    async setFirstName(firstname) {

        try {

            // Get the validation message, if any
            let msg = validate.single(firstname, constraints.name());

            // if the validation passes, format the input accordingly
            if(!msg) this.name.first = format.name(firstname);

            return msg;

        } catch (err) {
            throw( new Error(err));
        }
    }


    // Set the last name
    async setLastName(lastname) {

        try {

            // Get the validation message, if any
            let msg = validate.single(lastname, constraints.name());

            // if the validation passes, format the input accordingly
            if(!msg) this.name.last = format.name(lastname);

            return msg;
            
        } catch (err) {
            throw( new Error(err));
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
                    delete record.tags;
                    delete record.notes;
                    delete record.banned;
                    delete record.activated;
                    delete record.internal;
                break
            }

            return record;

        } catch (err) {

            throw( new Error(err));
        }
    }

    // Set the handle
    async setHandle(handle) {

        try {

            // Get validation message(s), if any
            let msg = validate.single(handle, constraints.handle());

            // If validation passes, format the input accordingly
            if(!msg) this.handle = format.handle(handle);

            return msg;
            
        } catch(err) {
            
            throw( new Error(err));
        }
    }

    // Set the password hash
    async  setPasswordHash(password) {

        try {

            // Get validation message(s), if any
            let msg = validate.single(password, constraints.password());
            if(msg) return msg;
            
            // Get password strength
            let passwordResult = zxcvbn(password);

            if(passwordResult.score <= 2) {
                let feedback = passwordResult.feedback.warning;
                msg = feedback.length ? feedback : "Password is not strong enough";
                return (msg)
            }

            // Hash the password
            let passwordHash = await bcrypt.hash(password, 10);
            this.security.passwordHash = passwordHash;

            return  false;

        } catch (err) {
            throw(new Error(err));
        }
    }

    // Set the email address
    async  setEmailAddress(email) {

        try {

            // Get validation message(s), if any
            let msg = validate.single(email, constraints.emailAddress());

            // If validation passes, format the input accordingly
            if(msg) {
                return msg
            } else {
                this.email = format.emailAddress(email);
            }
        } catch (err) {
            throw(new Error(err));
        }
    }

    // Set the Policy Agreement to which user has agreed to
    async setPolicyAgreement(policyName, policyVersion) {

        try {

            // Get validation message (s), if any
            let msg = validate.single(policyVersion, constraints.policyVersion(policyName, policyVersion));
            // Check to see if errors exist in the msg
            if(!msg) {
                // Get the current version of the policy and make sure it matches the one sent
                // Calling the policy model to check the user policies
                let policy = new Policy(policyName);
                // Only get policy metadata to check version
                await policy.load(false);
                if(policy.err) throw(new Error('Could not pull current version of policy to compare to the user agreed version'));
                if(policy.version !== policyVersion) msg = ['Policy version is not current'];
                
                // Set the the policy version to the user object if all checks passed
                this.policies[policyName] = format.policyVersion(policyVersion);
            }
            return msg

        } catch (err) {

            throw( new Error(err));
        }
    }


    // Set the first name
    async setDobYear(year) {

        try {

            // Get the validation message, if any
            let msg = validate.single(year, constraints.dobYear());

            if (msg) {
                return msg;
            } else {
                this.dob.year = year;
                return;
            }
            

        } catch (err) {
            throw( new Error(err));
        }
    }

    // Set the first name
    async setDobMonth(month) {

        try {

            // Get the validation message, if any
            let msg = validate.single(month, constraints.dobMonth());

            if (msg) {
                return msg;
            } else {
                this.dob.month = month;
                return;
            }
            

        } catch (err) {
            throw( new Error(err));
        }
    }

    // Set the first name
    async setDobDay(day) {

        try {

            // Get the validation message, if any
            let msg = validate.single(day, constraints.dobDay());

            // Make sure year has been set
            if(!this.dob.year) throw(new Error('Dob.day cannot be set on user object before year'));
            
            // Make sure mont has been set
            if(!this.dob.mont) throw(new Error('Dob.day cannot be set on user object before month'));

            let maxDays = 31;
            switch (this.dob.month) {
                case 9:
                case 4:
                case 6:
                case 11:
                    maxDays = 30;
                break;
                case 2:
                    maxDays = 29;

            }
            if(day > maxDays) {
                return ['day choosen is not valid given the month'];
            }
            if(this.dob.month == 2 && day === 29) {
                if(!(((this.dob.year%4 == 0) && (this.dob.year % 100 != 0)) || (this.dob.year % 400 == 0))){
                    return ['day and month combination is not valid given the year'];
                }
            }

            // If validatiion passes, format the  input  accordingly
            if (msg) {
                return msg;
            } else {
                this.dob.day = day;
                return;
            }
            

        } catch (err) {
            throw( new Error(err));
        }
    }

    // Validate age as per limit
    async isAgeValid(minYears) {
        try {

            let isValid = false;

            // Make sure year has been set
            if(!this.dob.year) throw(new Error('Age cannot be set on user object before year'));
            
            // Make sure month has been set
            if(!this.dob.month) throw(new Error('Age cannot be set on user object before month'));
            
            // Make sure day has been set
            if(!this.dob.day) throw(new Error('Age cannot be set on user object before month'));

            // Calculate the duration between now and the  user's DOB
            let day = this.dob.day < 10 ? ' ' + this.dob.day : this.dob.day;
            let month = this.dob.month < 10 ? ' ' + this.dob.month : this.dob.month;

            let start = new moment(month+'-'+day+'-'+this.dob.year, 'MM-DD-YYYY');
            let end = new moment();

            let duration = moment.duration(end.diff(start));
            let years = duration.asYears();

            if (years >= 18) isValid = true;

            return isValid;


        } catch (err) {
            throw( new Error(err));
        }
    }



}



module.exports = _;