/*jshint esversion: 8 */

const app = require('../../dist/app');
const supertest = require('supertest');
describe('RequestMethods Tests', function () {

    it("Should replay to GET method all params", (done) => {
        const UID = "184d5672-2622-4e43-a476-dd8515bca292";
        supertest(app)
            .get('/http-controller/' + UID)
            .expect(200, UID, done);
    });

    it("Should replay to GET method By param name", (done) => {
        const id = "184d5672-2622-4e43-a476-dd8515bca292";
        const name = "Aymen";
        supertest(app)
            .get('/http-controller/' + id + '/' + name)
            .expect(200, `${id}-${name}`, done);
    });

    it("Should replay to POST method by name", (done) => {
        const body = {
            name: "aymen"
        };
        supertest(app)
            .post('/http-controller/byname')
            .send(body)
            .set('Accept', 'application/json')
            .expect(200, body.name, done);

    });
    
    afterAll(() => {
        app.close();
        setTimeout(() => process.exit(), 1000);
    });
});