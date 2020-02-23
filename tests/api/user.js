const request = require('supertest');
describe('loading express', function () {
    let server;
    beforeEach(function () {
        server = require('../../index.js');
    });
    afterEach(function () {
        server.close();
    });


    it('responds to a post on /users', function testData(done) {
        request(server)
            .post('/users')
            .send({
                "username": "john",
                "password": "ck5h1u3o200j21hd39ymop3vj"
            })
            .expect(201)
            .expect((res) => {
                res.body.token != undefined
            });
    });

    it('should check the payload to /users', function testData(done) {
        request(server)
            .post('/users')
            .send({
                "username": "john",
            })
            .expect(422, done);
    });

    it('404 everything else', function testPath(done) {
        request(server)
            .get('/')
            .expect(404, done);
    });
});