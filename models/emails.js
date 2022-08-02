/**
 * Application Type: Model
 * Model Handler: Emails
 * Description: File handles all the email model (datastore and functions) for paths defined
 * 
 */


//  Base Dependencies
const base = require('./sqs');
const { cloneDeep } = require('lodash');

// Validation Dependencies
const constraints = require('./../lib/constraints');
const format = require('./../lib/format');
const validate = require('validate.js');

const handlebars = require('handlebars');
const mailgun = require('mailgun-js');
const secretsLib = require('./../lib/secrets')


// Create model to export to app
let _ = class extends base {

    // Load a pth, or create a new path with default values
    // Set Defaults using the parent base  class (models/s3.js)
    /**
     * constructor() function will set the default value by initiating the constructor inside of the base class (models/dynamo.js) class 
     * 
     *      constructor() {
     *          this.created = Date.now()
     *          this._id = uuidv4();
     *      }
     * 
     * 
     */
    constructor(_id) {

        // Inherit all defaults using the parent base  class (models/dynamo.js) and use is as 'super' e.g super.load()
        super();

        // Set the specified _id
        this.to = null;
        this.from =  'Sabza <hello@sabza.pk>';
        this.subject = null;
        this.body = null;
    }


    // Load this new email to the sending queue
    async queue() {
        await super.queue('emails');
    }

    // Load the next available item from the queue
    async load() {
        await super.load('emails');
    }

    // Remove the item from the queue
    async remove() {
        await super.remove('emails');
    }

    // Send the mail
    async send() {
        return new Promise((resolve, reject) => {
            const mailgun = require('mailgun-js')({
                apiKey: secretsLib.secrets.mailgun.privateKey,
                domain: secretsLib.secrets.mailgun.domain
            });

            const data = {
                from: this.from, 
                to: this.to,
                subject: this.subject,
                text: this.body
            };

            mailgun.messages().send(data, (err, body) => {
                if(err) this.err = [err];
                console.log(body);
                resolve();
            })
        })
    }

    // Seet the 'to' address
    async setTo(to) {
        try {

            // Get validation message(s), if any
            let msg = validate.single(to, constraints.emailAddress());

            // if validation passes, format the input accordingly
            if(!msg) this.to = format.emailAddress(to);

            return msg;

        } catch (err) {
            
            throw( new Error(err) );
        }
    }

    // Set the subject and body
    async setContent(templateName, data) {
        try {
            
            // Get the template
            let templateFile = require('./../templates/'+templateName);
            let source = null;
            let template = null;

            // Set the subject
            source = templateFile.subject;
            template = handlebars.compile(source);
            this.subject = template(data);

            // Set the body
            source = templateFile.body;
            template = handlebars.compile(source);
            this.body = template(data);

            return true;
        } catch (err) {            
            throw(new Error(err));
        }
    }
    




    // End of _
}






module.exports = _ ;