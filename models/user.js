const { hash } = require('../persistence/encryption');

module.exports = class User {
    constructor(username, password) {
        this.username = username;
        this.password = hash(password);
    }
}
