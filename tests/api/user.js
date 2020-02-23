const request = require('supertest');
const inMemoryDB = require('../../persistence/inMemoryDB')

const UserDAO = require('../../DAO/user');
const TokenDAO = require('../../DAO/token');

const tokens = new TokenDAO(inMemoryDB.db());
const users = new UserDAO(tokens, inMemoryDB.db())
const Server = require('../../server.js');


describe('loading express', function () {
    let server;
    beforeEach(function () {
        testServer = new Server(users, tokens)
        server = testServer.run();
    });

    afterEach(function () {
        server.close();
    });


    it('responds to a post on /users should contain the token', function testData(done) {
        request(server)
            .post('/users')
            .send({
                "username": "john",
                "password": "ck5h1u3o200j21hd39ymop3vj"
            })
            .expect(201)
            .expect((res) => {
                if (!res.body.token) {
                    throw new Error("token missing");
                }
            }).end(done);
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