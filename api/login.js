const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.login = (userDAO, tokenDAO) => {
    return (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const user = new User(req.body.username, req.body.password)
        const storedUser = userDAO.getUser(user.username);
        if (!storedUser) {
            return res.status(404).json({ errors: "User not found" })
        }
        if (!userDAO.isValidPassword(storedUser.password, user.password)) {
            return res.status(401).json({ errors: "Incorrect credentials" })
        }
        const token = tokenDAO.generateToken(user)
        res.json({ token: token })
    };
};
