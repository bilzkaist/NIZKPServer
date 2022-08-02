/**
 * Application Type: Model
 * Model Handler: SQS Email handler
 * Description: File handles all the s3 Bucket model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Secrets  Dependencies
const secretsLib = require('./../lib/secrets');

// Support Dependencies
const helpers = require('./../lib/helper');

// Load Aws module to export & set configurations
const AWSregion = "us-west-2";
AWS.config.update({
    region: AWSregion
});

// Instantiating a new AWS S3 Bucket Object to handle operations
const sqs = new AWS.SQS();

// Create module to export
let _ = class {

    // Set fields that are common to all records in the table
    constructor() {
        // Set defaults _id -> set _id = 'terms' or 'privacy'
        this._id = null;
        this.created = Date.now();
        this.internal = {};

        
        // Enf of  _.constructor()
    }

    // Remove a record from a specific queue
    async remove(queue = false) {

        try {
            if(!queue) throw(new Error('No queue name defined when attempting to remove from the queue'));
            let secrets = secretsLib.secrets;
            let fullQueueName = secrets.sqs.queuePrefix + queue;
            let params = {
                'QueueUrl' : fullQueueName,
                'ReceiptHandle' : this.receiptHandle
            }

            let result = await sqs.deleteMessage(params).promise();
            if(result) {
                return true;
            } else {
                this.err = 'Could not remove item from the queue';
                return false;
            }

            return true;
        } catch (err) {
            console.log(err)
            throw( new Error(err));
        }
    }

    // Save a record to a specific queue
    async  queue(queueName = false) {

        try {
            if(!queueName) throw(new Error('No queue name defined when attempting to queue the data.'));
            let secrets = secretsLib.secrets;
            let fullQueueName = secrets.sqs.queuePrefix + queueName;

            let params = {
                'MessageBody' : JSON.stringify(this),
                'QueueUrl'  : fullQueueName
            };

            let result = await sqs.sendMessage(params).promise();

            if(result) {
                return true;
            } else {
                this.err =  'Could not add item to the queue';
                console.log(this.err);
                return false;
            }
            return true
        } catch (err) {
            throw(new Error(err))
        }
    }


    // Load a new record from SQS
    async load(queue = false) {
        try {
            if(!queue) throw(new Error('No S3 queue name defined when attempting to load a new message.'))
            let secrets = secretsLib.secrets;
            let fullQueueName = secrets.sqs.queuePrefix + queue;
            // Pull item from the queue
            let params = {
                'QueueUrl': fullQueueName,
                'MaxNumberOfMessages': 1,
                'VisibilityTimeout': 60,
                'WaitTimeSeconds': 5
            };

            let result = await sqs.receiveMessage(params).promise();
            // Set that items properties on this class
            if(result.Messages && result.Messages.length) {
                let message = result.Messages[0];
                let messageString = message.Body;
                let messageData = helpers.getObjectFromJson(messageString);
                this.receiptHandle = message.ReceiptHandle;

                if(messageData) {
                    // Assign all values to this
                    for (let key in messageData) {
                        this[key] = messageData[key]
                    }
                } else {
                    this.err = 'SQS message was found, but was not properly formatted';
                }

            } else {
                this.err = 'No unread message was found in the sqs queue';
            }

            return true;
        } catch (err) {
            console.log(err)
            throw(new Error(err));
        }
    }
    


    // Enf of  _ class
}


module.exports = _ ;

