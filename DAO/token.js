const moment = require('moment');
module.exports = class TokenDAO {
    constructor(dataStore) {
        this.db = dataStore;
        this.collection = "tokens";
    }

    saveToken = (token) => {
        return this.db.collection(this.collection).insertOne(token).then(saved => token.token);
    }

    isTokenValid = (token) => {
        return this.db.collection(this.collection).findOne({ "token": token }).then(t => {
            const now = moment();
            return t && moment(t.validUntil).diff(now) >= 0;
        })
    }

}

