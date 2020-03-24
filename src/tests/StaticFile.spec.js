/*jshint esversion: 8 */

const app = require('../../dist/app');
const supertest = require('supertest');
describe('UserController Tests', function () {

    it("Should display the favicon file)", (done) => {
        supertest(app)
            .get('/favicon.ico')
            .expect(200, done);
    });

    it("Should display the logo", (done) => {
        supertest(app)
            .get('/logo.png')
            .expect(200, done);
    });

    it("Should display the 404 page", (done) => {
        supertest(app)
            .get('/404.html')
            .expect(200, done);
    });
    
    it("Should display the 500 page", (done) => {
        supertest(app)
            .get('/500.html')
            .expect(200, done);
    });
    
    afterAll(() => {
        app.close();
        setTimeout(() => process.exit(), 1000);
    });
});