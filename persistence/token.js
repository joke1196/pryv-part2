const nanoid = require('nanoid')
const moment = require('moment');


let tokens = new Map();


exports.generateToken = () => {
    const tokenStr = nanoid();
    const token = {
        token: tokenStr,
        validUntil: moment().add(2, 'days')
    };

    tokens.set(token.tokenStr, token);
    return tokenStr;

}

exports.isTokenValid = (tokenStr) => {
    let token = tokens.get(tokenStr);
    return token && token.validUntil.diff(moment()) >= 0
}
