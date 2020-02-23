const Server = require('./server');


const UserDAO = require('./DAO/user');
const TokenDAO = require('./DAO/token');

const tokens = new TokenDAO()
const users = new UserDAO(tokens)

const port = 1234

const server = new Server(users, tokens, port);

server.run(`App listening on port ${port}`);

