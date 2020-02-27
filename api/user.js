const { validationResult } = require('express-validator');
const User = require('../models/user');
const Token = require('../models/token');

exports.create = (userDAO, tokenDAO) => {
    return (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const user = new User(req.body.username, req.body.password)
        userDAO.getUser(user.username).then(storedUser => {
            if (storedUser) {
                return res.status(409).json({ errors: "User already exists" });
            }
            return userDAO.saveUser(user).then(r => {

                return tokenDAO.saveToken(new Token()).then(t => {
                    return res.status(201).json({ token: t });
                })
            })
        }).catch(err => {
            console.log("Error", err);
            return res.status(500).json({ error: err });
        })
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