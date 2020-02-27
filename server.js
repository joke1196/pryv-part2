const express = require('express')
const bodyParser = require('body-parser');
const { checkSchema } = require('express-validator');

const user = require('./api/user');
const auth = require('./api/auth');
const resource = require('./api/resource');

const TokenDAO = require('./DAO/token');
const UserDAO = require('./DAO/user');
const ResourceDAO = require('./DAO/resource');


module.exports = class Server {
    constructor(dbClient) {
        this.app = express();
        this.app.use(bodyParser.json());

        this.tokens = new TokenDAO(dbClient);
        this.users = new UserDAO(dbClient);
        this.resources = new ResourceDAO(dbClient);

        // User routes
        this.app.post("/users", checkSchema(user.schema()), user.create(this.users, this.tokens));

        // Login routes
        this.app.post("/auth/login", checkSchema(user.schema()), auth.login(this.users, this.tokens));

        // Resources routes
        this.app.post("/resources", auth.authentication(this.tokens), checkSchema(resource.schema()), resource.create(this.resources));

        this.app.get("/resources/:id", auth.authentication(this.tokens), resource.get(this.resources));

        this.app.delete("/resources/:id", auth.authentication(this.tokens), resource.delete(this.resources));

        this.app.put("/resources/:id", auth.authentication(this.tokens), checkSchema(resource.schema()), resource.update(this.resources));
    }
}