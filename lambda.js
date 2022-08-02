exports.handler = async (event) => {
    // Dependencies
    
    const AWS = require('aws-sdk')
    const AWSregion = "us-east-2";
    AWS.config.update({region: AWSregion});
    
    const s3 = new AWS.S3();
    
    exports.handler = async (event) => {
        
        // Setup the basic response
        const response = {
            statusCode: 200
        };
        
        // Parse the incoming webhook pyload
        console.log("Attempting to parse the incoming payload");
        const querystring = require('querystring');
        let parsed = querystring.decode(event.body);
        let box = parsed.To.split('@')[0];
        let text = parsed['stripped-text'];
        let subject = parsed.subject;
        
        if(box && text && subject). {
            // if we were able to parse the components, create a new s3 file in an appropriate box
            console.log("Parsing successful. Putting the file on s3");

            let fileContents = JSON.stringify({
                'box' : box,
                'text' : text,
                'subject' : subject
            });

            let fileName = querystring.escape(subject);

            let params = {
                ACL: "private",
                Body: Buffer.from(fileContents),
                Bucket: "mailgun-email-test-bucket",
                Key: box+"/"+fileName+'.json'
            };

            let result = await s3.putObject(params).promise();

            console.log(result);

            return response;
            
        } else {

            // if fails, just log it out so we can debug from the logs after
            console.log('Parsing failed');
            console.log(parsed, event.body);
            response.statusCode = 500;
            return response;
        }
        
    }