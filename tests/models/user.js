

const assert = require('assert');
const User = require('../../models/user');

describe('User', function () {
    describe('creation', function () {
        it('should an encrypted password', function () {
            const uname = 'username'
            const password = 'password'
            const myUser = new User(uname, password)
            assert.equal(myUser.username, uname);
            assert.notEqual(myUser.password, password);
        });
    });
});