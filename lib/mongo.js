/**
 * Application Type: Library
 * Library Handler: Mongo Integration
 * Description: File handles all the rmongo db integration
 * 
 */

// mongodb+srv://sabza-localhost:<password>@sabza-prod-db-cluster-01-aelcs.mongodb.net/test?retryWrites=true&w=majority
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://neurasynaptics:<password>@cluster0.j9nj0.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });




//  Dependencies
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ServerApiVersion } = require('mongodb');
// const secretsLib = require('./secrets');


// Create module to export 
let _ = {};



// Load MongoDB
_.start = async (secrets) => {

    try {

        let msg = '';

        // Get the mongo settings from the secrets
        _.settings = secrets.mongo;

        // Connection String
        _.connectionUri = `${_.settings.protocol}${_.settings.username}:${_.settings.password}@${_.settings.Url}`;
        // Create Client
        _.client = new MongoClient(_.connectionUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        // Connect to the db
        // Check to establish connection with Mongo DB Cloud Atlas Service
        await _.client.connect();

        // // Create a specific connection to the databse
        _.db = await _.client.db(_.settings.databse)

        // // Log and return
        console.log('MongoDB connection established with MongoDB Cloud Atlas');
        return true;
       
    } catch (err) {

        throw( new Error(err));

    }
};

// _.local = async (secret) => {

// }



module.exports = _;