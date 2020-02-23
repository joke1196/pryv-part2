const express = require('express')
const bodyParser = require('body-parser');
const { checkSchema } = require('express-validator');
const user = require('./api/user');


const app = express();
const port = 1234;

app.use(bodyParser.json());

// User routes
app.post("/users", checkSchema(user.schema()), user.create)


const server = app.listen(port, () => console.log(`App listening on port ${port}!`))
module.exports = server;
