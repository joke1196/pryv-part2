const express = require('express')
const bodyParser = require('body-parser');
const { checkSchema } = require('express-validator');

const user = require('./api/user');
const login = require('./api/login');



module.exports = class Server {

    app = express();
    constructor(users, tokens, port = 1234) {
        this.app.use(bodyParser.json());
        this.port = port;

        // User routes
        this.app.post("/users", checkSchema(user.schema()), user.create(users))

        // Login routed
        this.app.post("/auth/login", checkSchema(user.schema()), login.login(users, tokens))

    }

    run = (message) => this.app.listen(this.port, () => console.log(message))

}