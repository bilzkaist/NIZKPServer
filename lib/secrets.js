/**
 * Secrets Manager to load all secrets from AWS Secrets Manager
 */

//  Dependencies 
const helpers = require('./helper');
const AWS = require('aws-sdk');


// Load AWS resources
const AWSregion = "us-west-2"
AWS.config.update({region: AWSregion });
const opsworks = new AWS.OpsWorks();
const secretsmanager = new AWS.SecretsManager({
    region: AWSregion
});
const iam = new AWS.IAM();

// Create module to export
let _ = {};

// Secret data (to be filled in later)
_.secrets = {};



// Get the username (or service role name), and the type of user ("user" or "role")
_.getUserNameAndType = async () => {
    try {

        // Get the profile of the user making this request
        let thisUser = await opsworks.describeMyUserProfile().promise();
        let userName = thisUser.UserProfile.Name;

        // Record the name and role. 
        // If their name include a slash (/) then their type is service role (roles)
        let data = {'name': userName, 'type': 'user'};
        if (userName.indexOf('/') > -1) {
            data.type = 'role';
            data.name = userName.split('/')[0];

        }
        // console.log('Data Returned from GetUserNameAndType Function \n' + data)
        return data;

    } catch (err) {
        throw( new Error(err));
    }
};

// Get the value of the deployment tag associated with the user or the service role
_.getDeploymenyTag = async (name, type) => {

    try {

        // Set the parameter for the request
        let params = {
            'UserName' : name
        };
        let functionToCall = 'listUserTags';

        // Switch the params if the user is a service role
        if( type == 'role') {
            params = {
                'RoleName' : name
            };
            functionToCall = 'listRoleTags';
        }

        // Make the request
        let data = await iam[functionToCall](params).promise();

        // Look for the value of the deployment keys in the response
        let deploymentTagValue = false;
        for (let tag of data.Tags) {
            if (tag.Key == 'deployment') {
                deploymentTagValue = tag.Value;
            }
        }

        // Return or throw an error
        if(deploymentTagValue) return deploymentTagValue.trim().toLowerCase();
        throw( new Error('Could not find the deployment key set in the user\'s tags'));


    } catch (err) {
        throw( new Error(err));
    };
}
// Get the names of all the secrets ( from the Secrets Manager ) whose deploymeny tag matches a certain value
_.getAllSecretsByTag = async (tag) => {
        
    try {

        // Define an array that we'll fill with the name of the secret
        let secretNames = [];

        // Make the request
        let data = await secretsmanager.listSecrets().promise();
        // Check which secrets have the deployment tag matching the value we're looking for
        for (let secret of data.SecretList) {
            if(typeof(secret.Tags) === 'object' && secret.Tags instanceof Array && secret.Tags.length > 0) {
                for (let secretTag of secret.Tags) {
                    if(secretTag.Key === 'deployment' && secretTag.Value === tag && secretNames.indexOf(secret.Name) == -1 ) {
                        secretNames.push(secret.Name);
                    }
                }
            }
        }

        // // Return the requested Value or Throw an error
        if(secretNames.length) return secretNames;
        throw( new Error('Could not retrive any secrets'));
    } catch (err) {
        throw( new Error(err));
    }
    
};

// 
_.getSecretData = async (secrets) => {

    try {

        // Define an object that will hold the secrets
        let secretData = {};

        // Count the secrets that are retreived
        let secretsRetreived = 0;

        // For each secret in the lsit, try and retrive its value
        for (let secret of secrets) {
            let params = {
                SecretId: secret
            };


            let data = await secretsmanager.getSecretValue(params).promise();
            let parsedSecret = helpers.getObjectFromJson(data.SecretString);

            
            if(parsedSecret && secret.indexOf('/') > -1) {
                secretData[secret.split('/').slice(-1)[0]] = parsedSecret;
                secretsRetreived++;
            }
        }

        
        // _.secrets = secretData;
        if(secretsRetreived) return secretData;
        throw( new Error('Could not retrive any secrets'));

    } catch (err) {
        throw( new Error(err));
    }
}

// Load all the steps 
_.load = async () => {

    try {
        
        // // Get the user data - returns name of user and the type of user
        let userData = await _.getUserNameAndType();

        // // Get user's deployment tag - looking at the entity and their tags and returning the value of the deployment tag. 
        let userTag = await _.getDeploymenyTag(userData.name, userData.type);
        // console.log("Loading the tag"   + userTag);

        // // Get all the sercrets for the tag
        let secrets = await _.getAllSecretsByTag(userTag);
        
        // // Get value of each secret
        let secretData = await _.getSecretData(secrets);

        // Return Data
        return secretData;
    } catch (err) {
        throw( new Error(err));
    }
};

module.exports = _;