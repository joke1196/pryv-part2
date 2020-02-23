const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.create = (userDAO) => {
    return (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const user = new User(req.body.username, req.body.password)
        const storedUser = userDAO.getUser(user.username);
        if (storedUser) {
            return res.status(409).json({ errors: "User already exists" })
        }
        const token = userDAO.saveUser(user)

        res.status(201).json({ token: token })
    };
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