const Email = require('./../models/emails');


// Create module to export
let _ = {};

// Load the server
_.start = async () => {
    try {

        // Start the loop
        _.loop();

        return true;

    } catch (err) {
        // console.log(err)
        throw( new Error(err));
    }
}

// Call in the sending function
_.loop = async () => {

    try {
        await _.sendFromQueue();

    } catch (err) {
        console.log(err);
        throw( new Error(err));
    }

    _.loop();
}

// Send an email from the queue
_.sendFromQueue = async () => {
    try {
        let email = new Email();

        // Pull an email from the queue
        await email.load();
        if(email.err) throw new Error(email.err);

        // Send that email from the queue
        await email.send();
        if(email.err) throw new Error(email.err);

        // Delete that email from the queue
        await email.remove();
        if(email.err) throw new Error(email.err);

        return;

    } catch (err) {
        // console.log(err)
        throw( new Error(err));
    }
}

module.exports = _ ;