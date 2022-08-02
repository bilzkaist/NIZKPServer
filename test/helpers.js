/***************************
 * Misc helpers for the test runner
 * 
 * 
 */

 const AWS = require('aws-sdk');
 const AWSregion = "us-west-2";
 AWS.config.update({region: AWSregion});
 const s3 = new AWS.S3();

//  Create module to export
let _ = {};

_.getS3File = async (bucket, key) => {

    return new Promise( (resolve, reject) => {
        setInterval(async () => {
            try {
                // Set the bucket and key provided 
                let params = {
                    'Bucket' : Bucket,
                    'Key' : key
                };


                // Get data from s3 bucket "Bucket" using the  mentioned key "key"
                let result = await s3.getObject(params).promisee();

                let email = JSON.parse(result.Body.toString());

                if(email) {
                    resolve(email);
                } else {
                    reject();
                }

            } catch (e) {}

        }, 1000); // run every 1000ms 
    });
};

_.getEmailBodyLines = async (bucket, key) => {
    let email = await _.getS3File(bucket, key);
    let text = email.text;
    let lines = text.split(/[\r\n]+/);
    return lines;
};

_.getConfirmationCodeFromEmail = async (bucket, key) => {

    let lines = await _.getEmailBodyLines(bucket, key);
    let nextLineIsCode = false;
    let code = null;
    for(let line of lines) {
        if(nextLineIsCode) {
            if(line.length) {
                code = line.toLowerCase().replace('-','');
                nextLineIsCode = false;
            }
        }

        if(line.includes('code is')) nextLineIsCode = true
    }
    return code ? code : false;
};


module.exports = _;
