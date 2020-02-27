const request = require('supertest');
const Server = require('../../server.js');
const Token = require('../../models/token');
const Resource = require('../../models/resource');
const db = require('../../persistence/db');
const cuid = require('cuid');

describe('Resources routes', function () {
    let server;
    let tokens;
    let resources;

    before(function (done) {
        const port = 1234
        db.connect(db.url, (err) => {
            if (err) {
                console.error(err)
            } else {
                testServer = new Server(db.get().db("test"));
                server = testServer.app.listen(port, () => "");
                tokens = testServer.tokens;
                resources = testServer.resources;
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

    it('creates a resource', function testData(done) {
        const token = new Token();
        tokens.saveToken(token).then(t => {
            const resource = { id: cuid(), data: { test: "yes", num: 123 } };
            request(server)
                .post('/resources')
                .set('Authorization', token.token)
                .send(resource)
                .expect(201)
                .end(done);
        })

    });

    it('returns a 401 if the header does not contain a token on resource creation', function testData(done) {
        request(server)
            .post('/resources')
            .expect(401)
            .end(done);
    });

    it('fetches a resource', function testData(done) {
        const token = new Token();
        const id = cuid();
        const resource = new Resource(id, { test: "yes", num: 123 });
        tokens.saveToken(token).then(t => {
            return resources.saveResource(resource)
        }).then(resource => {
            request(server)
                .get(`/resources/${id}`)
                .set('Authorization', token.token)
                .expect(200)
                .expect((res) => {
                    if (res.body.data.data.test !== resource.data.test) {
                        throw new Error("Incorrect data");
                    }
                })
                .end(done);
        })
    });

    it('returns a 404 if a resource does not exists when fetching a resource', function testData(done) {
        const token = new Token();
        tokens.saveToken(token).then(resource => {
            request(server)
                .get(`/resources/123`)
                .set('Authorization', token.token)
                .expect(404)
                .end(done);
        })
    });


    it('deletes a resource', function testData(done) {
        const token = new Token();
        const id = cuid();
        const resource = new Resource(id, { test: "yes", num: 123 });
        tokens.saveToken(token).then(t => {
            return resources.saveResource(resource)
        }).then(resource => {
            request(server)
                .delete(`/resources/${id}`)
                .set('Authorization', token.token)
                .expect(200)
                .expect((res) => {
                    if (res.body.data.data || !Number.isInteger(res.body.data.deleted)) {
                        throw new Error("Incorrect data");
                    }
                })
                .end(done);
        });
    });

    it('returns a 404 if a resource does not exists when deleting a resources', function testData(done) {
        const token = new Token();
        tokens.saveToken(token).then(resource => {
            request(server)
                .delete(`/resources/123`)
                .set('Authorization', token.token)
                .expect(404)
                .end(done);
        })
    });

    it('updates a resource', function testData(done) {
        const token = new Token();
        const id = cuid();
        const resource = new Resource(id, { test: "yes", num: 123 });
        const updatedNum = 321;
        const updatedTest = "updated"
        const updatedField = "test"
        const updateResource = { data: { test: updatedTest, num: updatedNum, field: updatedField } }
        tokens.saveToken(token).then(t => {
            return resources.saveResource(resource)
        }).then(resource => {
            request(server)
                .put(`/resources/${id}`)
                .set('Authorization', token.token)
                .send(updateResource)
                .expect(200)
                .expect((res) => {
                    if (res.body.data.data.test !== updatedTest ||
                        res.body.data.data.num !== updatedNum ||
                        res.body.data.data.field !== "test" ||
                        res.body.data.modified === resource.modified) {
                        throw new Error("Incorrect data");
                    }
                })
                .end(done);
        });
    });

    it('returns a 404 if a resource does not exists when updating a resources', function testData(done) {
        const token = new Token();
        const updatedNum = 321;
        const updatedTest = "updated"
        const updatedField = "test"
        const updateResource = { data: { test: updatedTest, num: updatedNum, field: updatedField } }
        tokens.saveToken(token).then(resource => {
            request(server)
                .put(`/resources/123`)
                .set('Authorization', token.token)
                .send(updateResource)
                .expect(404)
                .end(done);
        })
    });

});