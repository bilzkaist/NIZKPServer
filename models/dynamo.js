/**
 * Application Type: Model
 * Model Handler: DynamoDB
 * Description: File handles all the dynamodb model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const AWS = require('aws-sdk');
const attr = require('dynamodb-data-types').AttributeValue;
const { get }  = require('lodash');
const { cloneDeep } = require('lodash');

// Secrets  Dependencies
const secretsLib = require('./../lib/secrets');

// Load Aws module to export & set configurations
const AWSregion = "us-east-2";
AWS.config.update({
    region: AWSregion,
    // accessKeyId: 'AKIAQW4EGQUAIY6WXTRT'
    // endpoint: 'dynamodb.us-east-2.amazonaws.com',
    // endpoint: "http://localhost:8000"
});

// Instantiating a new DynamoDB Object to handle operations
const dynamoDB = new AWS.DynamoDB();

// Create module to export
let _ = class {

    // Set fields that are common to all records in the table
    constructor() {
        this.created = Date.now();
        this._id = null;
        this.refType = null;
        this.refId = null;
    }

    // Load this record from the database
    async load(table = false) {

        try {

            if(!table) throw( new Error('No tables name defined when attampting to load data'));
            if(!this._id) return this.err = 'No _id defined when attempting to load data';

            let secrets = secretsLib.secrets;
            let fullTableName = secrets.dynamo.tablePrefix + table;


            let item = cloneDeep(this);
            let params = {
                'Key': {
                    "_id": {
                        'S' : this._id
                    }
                },
                'TableName' : fullTableName
            };

            let result = await dynamoDB.getItem(params).promise();
            

            if(result.Item) {
                // Assign all the values to this
                let unwrapped = attr.unwrap(result.Item);
                for(let key in unwrapped) {
                    this[key] = unwrapped[key];
                }
            } else {
                this.err = 'Record with the specified _id cound not be found';
            }

            return true;

        } catch (err) {
            throw( new Error(err));
        }
    }


    // Save a record to a specific collection
    async save(table = false, doNotUpdate = false) {
        
        try {
            if (!table) throw(new Error('No table name defined when attempting to save data'));
            
            let secrets = secretsLib.secrets;
            
            let fullTableName = secrets.dynamo.tablePrefix + table;
            


            let item = cloneDeep(this);
            item.updated = Date.now();

            let params = {
                'Item' : attr.wrap(item),
                'TableName' : fullTableName
            };

            
            if (doNotUpdate) {
                params.ConditionExpression = "(#r<>:v)";
                params.ExpressionAttributeNames = {"#r" : "_id"};
                params.ExpressionAttributeValues = {
                    ":v" : {
                        'S' : item._id
                    }
                };
            }
            
            let result = await dynamoDB.putItem(params).promise();
            return true;


        } catch (err) {
            throw( new Error(err))

        }
    }
}


module.exports = _ ;

