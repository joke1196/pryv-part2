const deepEqual = require('deep-equal');

module.exports = class UserDAO {
    constructor(tokenDAO, dataStore) {
        this.db = dataStore;
        this.tokenDAO = tokenDAO;
    }

    saveUser = (user) => {
        this.db.set(user.username, user);
        return this.tokenDAO.generateToken();
    }

    getUser = (username) => {
        return this.db.get(username);
    }

    isValidPassword = (storedPassword, currentUserPassword) => {
        return deepEqual(storedPassword, currentUserPassword);
    }
}

