/**
 * HTTP Server file to run the application server
 */

// Dependencies
const express = require('express');
const router = require('./router');
const path = require('path');

const app = express();
const port = 4000;

const winston = require('winston');
const expressWinston = require('express-winston');


// ------------------------------------------------------- //

// create module to export
let _ = {};


// Load the server
_.start = async (secrets) => {

    try {

        // return new Promise((resolve, reject) => {
            // Start the app server
            app.listen(port);

            // Log the status of the server
            console.log('Application listening on port: ' + port);

            // Log the secret data received
            // console.log("Here are the secrets", secrets);

            return true
            // resolve();
        // }
    } catch (err) {

        throw( new Error(err));
    }
    
};

// Middlewares

// Set the app logger - Winston & Express-Winston
// app.use(expressWinston.logger({
//     'transports' : [
//         new winston.transports.Console()
//     ]
// }));

// Parse all request as JSON. Use json middleware
app.use(express.json());

router.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
  })

// Setting up EJS as templating engine for the app
app.set('views', path.join(__dirname + '../../views'));
app.set('view engine', 'ejs');
app.use(express.static("pages"));
console.log(path.join(  __dirname + '../../views'))

// app.get('/', (req, res) => {
//     res.render('pages/index');
// });

// Set the app router (Meaning: App should use 'router' for all of the paths)
app.use('/', router);








// Export App Server module as _ to run in index.js entry point
module.exports = _;