const request = require('supertest');
const Server = require('../../server.js');
const inMemoryDB = require('../../persistence/inMemoryDB');
const User = require('../../models/user');

const UserDAO = require('../../DAO/user');
const TokenDAO = require('../../DAO/token');

const tokens = new TokenDAO(inMemoryDB.db());
const users = new UserDAO(tokens, inMemoryDB.db())

describe('Auth routes', function () {
    let server;
    beforeEach(function () {
        testServer = new Server(users, tokens)
        server = testServer.run();
    });
    afterEach(function () {
        server.close();
    });

    it('return a token on /auth/login', function testData(done) {

        const user = {
            "username": "john",
            "password": "password"
        };

        const savedUser = new User(user.username, user.password);

        users.saveUser(savedUser);

        request(server)
            .post('/auth/login')
            .send(user)
            .expect(200)
            .expect((res) => {
                res.body.token != undefined
            }).end(done);
    });

});