const request = require('supertest');
const Server = require('../../server.js');
const User = require('../../models/user');
const db = require('../../persistence/db');

describe('Auth routes', function () {
    let server;
    let users;

    before(function (done) {
        const port = 1234
        db.connect(db.url, (err) => {
            if (err) {
                console.error(err)
            } else {
                testServer = new Server(db.get().db("test"));
                server = testServer.app.listen(port, () => "");
                users = testServer.users;
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



    it('return a token on /auth/login', function testData(done) {

        const userName = "bill";
        const clearPass = "password";

        const savedUser = new User(userName, clearPass);
        users.saveUser(savedUser).then(u => {
            request(server)
                .post('/auth/login')
                .send({ username: userName, password: clearPass })
                .expect(200)
                .expect((res) => {
                    res.body.token != undefined
                }).end(done);
        });

    });

    it('return a 404 if the user does not exists', function testData(done) {

        const userName = "bill";
        const clearPass = "password";
        request(server)
            .post('/auth/login')
            .send({ username: userName, password: clearPass })
            .expect(404)
            .end(done);

    });

});