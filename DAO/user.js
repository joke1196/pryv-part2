const deepEqual = require('deep-equal');

module.exports = class UserDAO {
    constructor(dataStore) {
        this.db = dataStore;
        this.collection = "users";
    }

    saveUser = (user) => {
        return this.db.collection(this.collection).insertOne(user).then(savedUser => {
            return user;
        });
    }

    getUser = (username) => {
        return this.db.collection(this.collection).findOne({ username: username });
    }

    isValidPassword = (storedPassword, currentUserPassword) => {
        return deepEqual(storedPassword, currentUserPassword);
    }
}

