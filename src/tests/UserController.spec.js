/*jshint esversion: 8 */

const app = require('../../dist/app');
const supertest = require('supertest');
describe('UserController Tests', function () {

    it("Should display the Index page", (done) => {

        supertest(app)
            .get('/index.html')
            .expect(200, done);
    });
    afterAll(() => setTimeout(() => process.exit(), 1000));

});