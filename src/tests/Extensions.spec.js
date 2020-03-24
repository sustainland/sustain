/*jshint esversion: 8 */

const app = require('../../dist/app');
const supertest = require('supertest');
describe('UserController Tests', function () {

    it("Should display the Index page (Swagger-UI)", (done) => {
        supertest(app)
            .get('/swagger-ui/')
            .expect(200, done);
    });
    afterAll(() => {
        app.close();
        setTimeout(() => process.exit(), 1000);
    });
});