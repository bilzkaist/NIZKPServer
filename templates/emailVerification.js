/***
 * Template for "Email Verification" email
 * This email gets sent to user when they attemmpt to verify an email address
 *
 */

//  Create module to export
let _ = {};
_.subject = `Your Sabza Confirmation Code`;

// Set the body of the email
_.body = `Hi from Sabza!

Your email confirmation code is: 
{{verification.humanReadableCode}}

If you did not request this code, you can this email.

You can also check what Sabza is buy visiting sabza.com

Thank you!

`;

// Module Export
module.exports = _;