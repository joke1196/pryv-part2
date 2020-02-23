const tokenPersistence = require('../persistence/token');


let users = new Map();

exports.saveUser = (user) => {
    users.set(user.username, user);
    return tokenPersistence.generateToken();
}

exports.doesUserExists = (user) => {
    return users.has(user.username);
}