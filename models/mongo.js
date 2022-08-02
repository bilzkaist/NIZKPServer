/**
 * Application Type: Model
 * Model Handler: Users
 * Description: File handles all the user model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const mongo = require('./../lib/mongo');
const assert = require('assert');
const { v4: uuidv4 } = require('uuid');


// Create model to export to app
let _ = class {

    // Set fields that are common to all records in all collection
    constructor() {
        this.created = Date.now()
        this._id = uuidv4();

    }

    // Save a record to a specific collection
    async save(collection = false) {

        try {
            if(!collection) throw( new Error('No collection name defined when attempting to save data'));

            // Upsert the document and verify
            this.updated = Date.now();
            let cmd = await mongo.db.collection(collection).updateOne({ _id : this._id}, { $set: this}, { upsert : true})
            assert.equal(1, cmd.modifiedCount + cmd.upsertedCount);
            return true;

        } catch (err) {

            throw( new Error(err));

        }
    }


    async load(collection = false) {

        try {

            if(!collection) throw( new Error('No collection name defined when attempting to save data'));
            if(!_id) throw( new Error('No _id defined when attempting to save data'));

            let item = cloneDeep(this);

            let result = await mongo.db.collection(collection).findOne({_id : this._id});

            if(result) {
                for (let key in result) {
                    this[key] = result[key];
                }
            } else {
                this.err = 'Record with the specified _id could not be found';
            }

            return true;

            
        } catch (err) {
            throw( new Error(err));
        }
    }
}



module.exports = _ ;