const request = require('supertest');
const Server = require('../../server.js');
const db = require('../../persistence/db');

describe('User routes', function () {
    let server;

    before(function (done) {
        const port = 1234
        db.connect(db.url, (err) => {
            if (err) {
                console.error(err)
            } else {
                testServer = new Server(db.get().db("test"));
                server = testServer.app.listen(port, () => "");
            }
            done();
        })
    });


    afterEach(function (done) {
        if (db.get()) {
            db.get().db("test").dropDatabase((err) => {
                done();
            });
        }
    });

    after(function (done) {
        server.close();
        db.close((err) => {
            if (err) console.error(err);
            done()
        });
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
});