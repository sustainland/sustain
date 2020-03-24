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

    it("Should replay to PUT method", (done) => {
        supertest(app)
            .put('/http-controller')
            .expect(200, done);
    });
    
    it("Should replay to PATCH method", (done) => {
        supertest(app)
            .patch('/http-controller')
            .expect(200, done);
    });

    it("Should replay to DELETE method", (done) => {
        supertest(app)
            .delete('/http-controller')
            .expect(200, done);
    });

    it("Should replay to HEAD method", (done) => {
        supertest(app)
            .head('/http-controller')
            .expect(200, done);
    });

    it("Should replay to OPTIONS method", (done) => {
        supertest(app)
            .options('/http-controller')
            .expect(200, done);
    });

    afterAll(() => {
        app.close();
        setTimeout(() => process.exit(), 1000);
    });

});