const { validationResult } = require('express-validator');
const User = require('../models/user');
const Token = require('../models/token');

exports.login = (userDAO, tokenDAO) => {
    return (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const user = new User(req.body.username, req.body.password)
        userDAO.getUser(user.username)
            .then(storedUser => {
                if (!storedUser) {
                    return res.status(404).json({ errors: "User not found" });
                }
                if (!userDAO.isValidPassword(storedUser.password, user.password)) {
                    return res.status(401).json({ errors: "Incorrect credentials" })
                }
                return tokenDAO.saveToken(new Token()).then(t => {
                    res.json({ token: t.token })
                });
            })

            .catch(err => {
                console.error(err)
                res.status(500).json({ error: "Internal server error" })
            })
    };
};

exports.authentication = (tokenDAO) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        if (authHeader) {
            tokenDAO.isTokenValid(authHeader).then(isValid => {
                if (isValid) {
                    return next();
                }
                return res.status(403).json({ message: "Wrong credentials provided" });
            })

        } else {
            return res.status(401).json({ message: "No authentication provided" });
        }

    }
}
