/**
 * API Tests for users route
 * 
 */

// Dependencies
const supertest = require('supertest');
const config = require('./config');
const { cloneDeep } = require('lodash');

// Library dependencies
const helpers = require('./helpers');


// Initiate the supertest client
const request = supertest.agent(config.url);

// const box = 'user_' + Date.now();
// const validPost = {
//     'name' : {
//         'first' : 'John',
//         'last' : 'Smith'
//     },
//     'handle' : 'test-'+Date.now(),
//     'policies' : {
//         'terms' : null,
//         'privacy' : null
//     },
//     'emailToken': {
//         _id : null
//     },
//     'password' : 'gAV0jc01x0fltHP8xwYz',
//     'dob': {
//         'month': 2,
//         'day': 29,
//         'year': 1976
//     },
//     'testNo' : 0
// };

// beforeAll() -> Sets a boilerplate to do all before performing the tests

// Before trying to create a user, get the current versions of the policies
// Programatically set the policy versions from the s3 bucket and save in validPost
// beforeAll (async () => {
//     // Get terms & Policies
//     const termsPolicy = await request.get('/policies').query({ '_id' : 'terms'});
//     validPost.policies.terms =  termsPolicy.body.version;

//     // Get  privacy  policies
//     const privacyPolicy = await request.get('/policies').query({ '_id' : 'privacy'});
//     validPost.policies.privacy =  privacyPolicy.body.version;

//     // Get Email Marketting Policies
    
//     // Trigger an email verification, and the request _id in the validPost
//     let verification = {};
//     let verificationResponse = await request.post('/emails/verifications').send({'email': box+config.sandboxEmailDomain});
//     verification._id = verificationResponse.body._id;

//     // Receive the email, and retrieve the confirmation code
//     let bucket = config.sandboxEmailBucket;
//     let key = box+'/'+config.emailKeys.emailVerification;
//     verification.code = await helpers.getConfirmationCodeFromEmail(bucket, key);

//     // Use the email and confirmation code to get an email token and add the token to the user payload
//     let tokenResponse = await request.post('/emails/tokens').send({'verification' : verification});
//     validPost.emailToken._id = tokenResponse.body._id;


//     return true;

// }, config.emailVerificationTimeout);

// Post
describe('POST /users', () => {


    // No payload is sent
    test('1. should return a 400 if no payload is sent', async () => {
        validPost.testNo = 1;
        const {status} = await request.post('/users');
        expect(status).toEqual(400);
    });


    // No payload is sent
    test('2. should show an error msg if no payload is sent', async () => {
        validPost.testNo = 2;
        const {body, status} = await request.post('/users');
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": expect.any(String)
            }
        }));
    });

    // Payload missing name.first
    test('3. should show an error message if payload is missing first name', async () => {
        validPost.testNo = 3;
        let payload = cloneDeep(validPost);
        delete payload.name.first;
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "name.first"
            }
        }));
    });

    // Name.first is invalid
    test('4. should show an error message if the first name is invalid', async () => {
        validPost.testNo = 4;
        let payload = cloneDeep(validPost);
        payload.name.first = 'John$';
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "name.first"
            }
        }))

    });

    // Payload missing name.last
    test('5. should show an error message if payload is missing last name', async () => {
        validPost.testNo = 5;
        let payload = cloneDeep(validPost);
        delete payload.name.last;
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "name.last"
            }
        }));
    });

    // Name.last is invalid
    test('6. should show an error message if the last name is invalid', async () => {
        validPost.testNo = 6;
        let payload = cloneDeep(validPost);
        payload.name.last = 'Sm*ith$';
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "name.last"
            }
        }))

    });

    // Payload missing handle
    test('7. should show an error message if payload is missing handle', async () => {
        validPost.testNo = 7;
        let payload = cloneDeep(validPost);
        delete payload.handle;
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "handle"
            }
        }));
    });

    // Handle is invalid
    test('8. should show an error message if the handle is invalid', async () => {
        validPost.testNo = 10;
        let payload = cloneDeep(validPost);
        payload.handle = 'S ith' + Date.now();
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "handle"
            }
        }))

    });


    // Handle is too short
    test('9. should show an error message if the handle is too short', async () => {
        validPost.testNo = 9;
        let payload = cloneDeep(validPost);
        payload.handle = 'a';
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "handle"
            }
        }))

    });


    // Handle is too long
    test('10. should show an error message if the handle is too long', async () => {
        validPost.testNo = 10;
        let payload = cloneDeep(validPost);
        payload.handle = '123456789012345678901234567890123456701234567890' + Date.now();
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "handle"
            }
        }))

    });

    // Password is missing
    test('11. should show an error message if payload is missing password', async () => {
        validPost.testNo = 8;
        let payload = cloneDeep(validPost);
        delete payload.password;
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "password"
            }
        }));
    });

    // Password is too short
    test('12. should show an error message if password is too short', async () => {
        validPost.testNo = 9;
        let payload = cloneDeep(validPost);
        payload.password = payload.password.substring(0,9)
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "password"
            }
        }));
    });

    // Password is too weak
    test('13. should show an error message if password is too weak', async () => {
        validPost.testNo = 9;
        let payload = cloneDeep(validPost);
        payload.password = 'abcdefghijk'
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "password"
            }
        }));
    });

    

    // Whole Policy object is missing
    test('14. should show an error message if policy object is missing', async () => {
        validPost.testNo = 11;
        let payload = cloneDeep(validPost);
        delete payload.policies;
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": expect.any(String)
            }
        }))

    });

    // Terms is missing from  the  policy object
    test('15. should show an error message if term is missing from the policy object', async () => {
        validPost.testNo = 12;
        let payload = cloneDeep(validPost);
        delete payload.policies.terms;
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "policies.terms"
            }
        }));
    });

    // Privacy is missing from  the  policy object
    test('16. should show an error message if privacy is missing from the policy object', async () => {
        validPost.testNo = 13;
        let payload = cloneDeep(validPost);
        delete payload.policies.privacy;
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "policies.privacy"
            }
        }));
    });

    // Terms is not the current version id
    test('17. should show an error message if terms is not the current version id', async () => {
        validPost.testNo = 14;
        let payload = cloneDeep(validPost);
        payload.policies.terms = 'not-the-current-version-id';
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "policies.terms"
            }
        }));
    });


    // Privacy is not the current version id
    test('18. should show an error message if privacy is not the current version id', async () => {
        validPost.testNo = 15;
        let payload = cloneDeep(validPost);
        payload.policies.privacy = 'not-the-current-version-id';
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "policies.privacy"
            }
        }));
    });

    // Email token is missing
    test('19. should show an error message if email Token is missing', async () => {
        validPost.testNo = 16;
        let payload = cloneDeep(validPost);
        delete payload.emailToken._id;
        
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "emailToken._id"
            }
        }));
    });

    // Email token is invalid
    test('20. should show an error message if email Token is missing', async () => {
        validPost.testNo = 17;
        let payload = cloneDeep(validPost);
        payload.emailToken._id += 'x';
        
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "emailToken._id"
            }
        }));
    });

    // DOB is missing from payload
    test('21. should show an error message if payload missing DOB', async () => {
        let payload = cloneDeep(validPost);
        delete payload.dob;

        
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.year"
            }
        }));
    });

    // DOB is missing from payload - month
    test('22. should show an error message if payload missing DOB - month', async () => {
        let payload = cloneDeep(validPost);
        delete payload.dob.month;

        
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.month"
            }
        }));
    });

    // DOB is missing from payload - day
    test('23. should show an error message if payload missing DOB - day', async () => {
        let payload = cloneDeep(validPost);
        delete payload.dob.day;

        
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.day"
            }
        }));
    });

    // DOB is missing from payload - year
    test('24. should show an error message if payload missing DOB - year', async () => {
        let payload = cloneDeep(validPost);
        delete payload.dob.year;

        
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.year"
            }
        }));
    });

    // DOB is invalid
    test('25. should show an error message if DOB is invalid', async () => {
        let payload = cloneDeep(validPost);
        payload.dob = 'foo';

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);

        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.year"
            }
        }));
    });

    // DOB - month is invalid
    test('26. should show an error message if DOB - month is invalid', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.month = 'foo';

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);
        
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.month"
            }
        }));
    });

    // DOB - year is invalid
    test('27. should show an error message if DOB - year is invalid', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.year = 'foo';

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);
        
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.year"
            }
        }));
    });

    // DOB - day is invalid
    test('28. should show an error message if DOB - day is invalid', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.day = 'foo';

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);
        
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.day"
            }
        }));
    });

    // DOB - user chose an  impossible day given the month
    test('29. should show an error message if the chooses a day this is not possible in the month chosen', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.month = 9;
        payload.dob.day = 31;

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);
        
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.day"
            }
        }));
    });

    // DOB - user choses leap day in a non leap year
    test('30. should show an error message if user choses leap day in a non leap year', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.year = 1977;

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);
        
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.day"
            }
        }));
    });


    // DOB - user too young
    test('31. should show an error message if the user is too young', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.month = 4;
        payload.dob.year = new Date().getFullYear() - 1;

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(403); 
    });

    // DOB - user older then oldeest known living personn
    test('32. should show an error message if user is older then the oldest known living person', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.year = 1901;

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);
        
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "dob.year"
            }
        }));
    });

    // DOB - user is in the future
    test('33. should show an error message if user is older then the oldest known living person', async () => {
        let payload = cloneDeep(validPost);
        payload.dob.year = new Date().getFullYear() + 1;

        
        const {body, status} = await request.post('/users').send(payload);

        expect(status).toEqual(400);
        
        
    });    

    // Correct payload
    test('21. should allow user to be created if handle doesnot exists and is avalible', async () => {
        validPost.testNo = 18;
        let payload = cloneDeep(validPost);
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            'created' : expect.any(Number),
            '_id' : expect.any(String),
            'name' : {
                'first' : payload.name.first,
                'last' : payload.name.last
            },
            'handle' : payload.handle,
            'updated' : expect.any(Number)
        }));


        expect(body.tags).toBeUndefined();
        expect(body.notes).toBeUndefined();
        expect(body.activated).toBeUndefined();
        expect(body.banned).toBeUndefined();
        expect(body.internal).toBeUndefined();
        expect(body.security).toBeUndefined();
        expect(body.password).toBeUndefined();
        expect(body.passwordHash).toBeUndefined();

    }, 20000); // Set timeout to 20000



    // Username already exists
    test('22. should not allow user to be created if handle already exist', async () => {
        validPost.testNo = 17;
        let payload = cloneDeep(validPost);
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(400);

        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "handle"
            }
        }));
    });




    // Whitespace should be removed
    test('23. should strip white spaces from the name of newly created user', async () => {
        validPost.testNo = 18;
        let payload = cloneDeep(validPost);
        payload.name.first = ' John    A   ';
        payload.name.last = ' Smith   ';

        payload.handle = 'test-' + Date.now();
        const {body, status} = await request.post('/users').send(payload);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            'name' : {
                'first' : 'John A',
                'last' : 'Smith'
            }
        }));
    });


});


// GET User test
describe('GET /users', () => {

    test('should return a 405', async () => {
        const response = await request.get('/users');
        expect(response.status).toEqual(405);
    });

});

// PUT User test
describe('PUT /users', () => {

    test('should return a 405', async () => {
        const response = await request.put('/users');
        expect(response.status).toEqual(405);
    });

});

// DELETE User test
describe('DELETE /users', () => {

    test('should return a 405', async () => {
        const response = await request.del('/users');
        expect(response.status).toEqual(405);
    });

});