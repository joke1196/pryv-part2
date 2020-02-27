const nanoid = require('nanoid');
const moment = require('moment');

module.exports = class Token {
    constructor() {
        const tokenStr = nanoid();
        this.token = tokenStr;
        this.validUntil = moment().add(2, 'days');
    }
}