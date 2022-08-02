/**
 * Application Type: Model
 * Model Handler: AWS S3 Bucket
 * Description: File handles all the s3 Bucket model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const AWS = require('aws-sdk');

const { get }  = require('lodash');
const { cloneDeep } = require('lodash');

// Secrets  Dependencies
const secretsLib = require('./../lib/secrets');

// Support Dependencies
const helpers = require('./../lib/helper');
const moment = require('moment')
// Load Aws module to export & set configurations
const AWSregion = "us-west-2";
AWS.config.update({
    region: AWSregion,
    // accessKeyId: 'AKIAQW4EGQUAIY6WXTRT'
    // endpoint: 'dynamodb.us-east-2.amazonaws.com',
    // endpoint: "http://localhost:8000"
});

// Instantiating a new AWS S3 Bucket Object to handle operations
const s3 = new AWS.S3();

// Create module to export
let _ = class {

    // Set fields that are common to all records in the table
    constructor() {
        // Set defaults _id -> set _id = 'terms' or 'privacy'
        this._id = null;
        
        // Enf of  _.constructor()
    }

    // Load this record from the s3 bucket with its content
    async load(bucket = false, loadContents = true) {
        try {
            // Error Handling : Check to see if s3 bucket name provided from which to load content
            if(!bucket) throw(new Error('No s3 bucket name defined when attempting  to load data'));
            // Error Handling : Check to see if _id provided to load
            if(!this._id) return this.err = 'No _id defined when attempting to load data'

            // Initiate secrets
            let secrets = secretsLib.secrets;
            let fullBucketName = secrets.s3.bucketPrefix + bucket;
            
            // Set params to handle the bucket
            let params = {
                'Bucket' : fullBucketName,
                'Key' : this._id+'.json'
            };
            try {

                let result = null;
                let data = null;
                // If Load Content is true also retrive content of the data otherwise only metadata
                if(loadContents) {
                    // load complete object from s3
                    result = await s3.getObject(params).promise();
                    
                    // Store body in data in JSON format using ./lib/helper.js function
                    data = helpers.getObjectFromJson(result.Body.toString());
                    
                    // Get the object name from data
                    this.name = data.name;

                    // Get the object content from data
                    this.content = data.content

                } else {
                    // load only the head  / metadata of the data from s3
                    result = await s3.headObject(params).promise();
                }

                // Get the object version  id / no stored in  s3 bucket
                this.version = result.VersionId;

                // Get the last updated of the object and convert to unix timestamp using moment lib
                this.updated = parseInt(moment(result.LastModified).format('x'));


            } catch (err) {
                this.err = 'Record with the specified _id could not be found. _id: ' + this._id;
            }

            return true;

        } catch (err) {
            throw( new Error(err));
        }


        // Enf of  _.load()
    }


    // Enf of  _ class
}


module.exports = _ ;

