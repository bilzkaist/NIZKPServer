/**
 * Application Router
 * 
 */


//  Dependencies
const express = require('express');


// Routing files
const def = require('./../routes/default');
const ping = require('./../routes/ping');
const users = require('./../routes/users');
const paths = require('./../routes/paths');
const policies = require('./../routes/policies');
const emailVerifications = require('./../routes/emailVerifications');
const emailTokens = require('./../routes/emailTokens');
const totpKeys = require('./../routes/totpKeys');
const totpTokens = require('./../routes/totpTokens');
const data = require('./../routes/data')
const uploads = require('./../routes/uploads');
const staticPages = require('./../routes/static');
const nizkp = require('./../routes/nizkp');

// Create module to export
let _ = express.Router();

// Ping
_.get('/ping', ping.get);
_.all('/ping', def._405);

// _.get('/nizkp/verify/:pub/:msg/:sig', nizkp.verify);

// Routes to serve static pages
_.get('/', staticPages.home);
_.get('/about', staticPages.about);
_.get('/apiendpoints', staticPages.apiendpoints);
_.get('/contact', staticPages.contact);



// Uploads
_.post('/uploads/csv', uploads.csv)
// Users
// _.get('/users', users.get);
_.post('/users', users.post)
_.all('/users', def._405);

// Upload CSV to MongoDB

// Data 
_.get('/data', data.post);

// Paths
// _.get('/paths', paths.get)
// _.all('/paths', def._405);

// // Policies
// _.get('/policies', policies.get);
// _.all('/policies', def._405);

// // Email Verifications
// _.post('/emails/verifications', emailVerifications.post);
// _.all('/emails/verifications', def._405);

// // Email Verifications
// _.post('/emails/tokens', emailTokens.post);
// _.all('/emails/tokens', def._405);

// // TOTP Keys
// _.post('/totp/keys', totpKeys.post);
// _.all('/totp/keys', def._405);

// // TOTP Tokens
// _.post('/totp/tokens', totpTokens.post);
// _.all('/totp/tokens', def._405);

// 404 Handler
_.all('*', def._404);

// Export router module as _ to router all request to relevant files
module.exports = _;