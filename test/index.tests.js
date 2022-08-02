/**
 * API test for index route
 * 
 */

//  Dependencies
const supertest = require('supertest');
const config = require('./config');


// Initiate the supertest client
const request = supertest.agent(config.url);


// Index
describe('/', () => {

    test('POST / should return a 404', async () => {
        const response = await request.post('/');
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty('error');
    });

    test('GET / should return a 200', async () => {
        const response = await request.get('/');
        expect(response.status).toEqual(200);
        // expect(response.body).toHaveProperty('error');
    });

    test('PUT / should return a 404', async () => {
        const response = await request.put('/');
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty('error');
    });

    test('DELETE / should return a 404', async () => {
        const response = await request.del('/');
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty('error');
    });


})