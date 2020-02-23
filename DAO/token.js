const nanoid = require('nanoid')
const moment = require('moment');

module.exports = class TokenDAO {
    constructor(dataStore) {
        this.db = dataStore;
    }

    generateToken = () => {
        const tokenStr = nanoid();
        const token = {
            token: tokenStr,
            validUntil: moment().add(2, 'days')
        };

        this.db.set(token.tokenStr, token);
        return tokenStr;
    }

    isTokenValid = (tokenStr) => {
        let token = this.db.get(tokenStr);
        return token && token.validUntil.diff(moment()) >= 0
    }

}

