/*jshint esversion: 8 */

const app = require('../../dist/app');
const supertest = require('supertest');
describe('RequestMethods Tests', function () {

    it("Should replay to GET method", (done) => {
        supertest(app)
            .get('/http-controller')
            .expect(200, done);
    });

    it("Should replay to POST method", (done) => {
        const body = {
            name: "aymen"
        };
        supertest(app)
            .post('/http-controller')
            .send(body)
            .set('Accept', 'application/json')
            .expect(200, body, done);

    });
   
    afterAll(() => {
        app.close();
        setTimeout(() => process.exit(), 1000);
    });

});