/**
 * API test for random route
 * 
 */

//  Dependencies
const supertest = require('supertest');
const config = require('./config');

// Initiate the supertest client
const request = supertest.agent(config.url);


// Index
describe('/{random}', () => {

    test('POST /{random} should return a 404', async () => {
        const response = await request.post('/'+Date.now());
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty('error');
    });

    test('GET /{random} should return a 404', async () => {
        const response = await request.get('/'+Date.now());
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty('error');
    });

    test('PUT /{random} should return a 404', async () => {
        const response = await request.put('/'+Date.now());
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty('error');
    });

    test('DELETE /{random} should return a 404', async () => {
        const response = await request.del('/'+Date.now());
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty('error');
    });


})