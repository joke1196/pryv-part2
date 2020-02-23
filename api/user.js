const { validationResult } = require('express-validator');
const userPersitence = require('../persistence/user');
const User = require('../models/user');

exports.create = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const user = new User(req.body.username, req.body.password)
    if (userPersitence.doesUserExists(user)) {
        return res.status(409).json({ errors: "User already exists" })
    }
    const token = userPersitence.saveUser(user)

    res.json({ token: token })
};

exports.schema = () => {
    return {
        'username': {
            isAlphanumeric: true,
            in: ['body']
        },
        'password': {
            isString: true,
            in: ['body']
        },
    }
}