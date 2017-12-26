const User = require('../models/user.model');
const crypto = require('../services/crypto.service');
const helpers = require('../services/helper.service');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function getUsers(req, res) {
    const docquery = User.find({}).read(ReadPreference.NEAREST);
    docquery.exec()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        res.status(500).send(error);
    });
}

function getUser(req, res) {
    User.findOne({ _id: req.params.id}, (error, user) => {
        if (helpers.checkServerError(res, error)) {
            return;
        }
        if(!helpers.checkFound(res, user)) {
            return;
        }
        return res.status(200).json(user);
    });
}

function loginUser(req, res) {
    var user = {};
    User.findOne({ email: req.body.email }, (error, user) => {
        if(helpers.checkServerError(res, error)) {
            return;
        }
        if(!helpers.checkFound(res, user)) {
            return;
        }

        // Check if Locked
        if(user.lockedUntil >= new Date()) {
            res.status(403).send('Account is locked!');
            return;
        }
    
        const saltedPassword = crypto.sha512(req.body.password, user.salt);
        var lockDate = new Date();
        if(saltedPassword !== user.password) {
            user.loginAttempts = user.loginAttempts++;
            if (user.loginAttempts >= 5) {
                user.lockedUntil = lockDate.setMinutes(lockDate.getMinutes() + 30);
            }
        } else {
            user.loginAttempts = 0;
            user.lastLogin = new Date();
            user.lockedUntil = lockDate.setMinutes(lockDate.getMinutes() - 30);
        }

        // Save User
        user.save(error => {
            if(helpers.checkServerError(res, error)) {
                return;
            }
        });

        if (user.loginAttempts === 0) {
            // Get and return Token
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 30);
            const token = crypto.sha512(user._id.toString(), expires.getTime().toString());
            const userToken = {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                expiresOn: expires,
                token: token
            };
            res.status(200).json(userToken);
        } else {
            res.status(403).send('Invalid Login!');
        }
    });
}

function addUser(req, res) {
    User.findOne({ email: req.body.email }, (error, item) => {
        if(helpsers.checkFound(res, item)) {
            res.status(409).send('Email already exists!');
            return;
        }
    });
    const salt = crypto.genRandomString(12);
    const saltedPassword = crypto.sha512(req.body.password, salt);
    var lockDate = new Date();
    const postedUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: saltedPassword,
        salt: salt,
        createdOn: new Date(),
        loginAttempts: 0,
        lockedUntil: lockDate.setMinutes(lockDate.getMinutes() - 30)
    };
    const user = new User(postedUser);
    user.save(error => {
        if (helpers.checkServerError(res, error)) {
            return;
        }
        res.status(201).json(post);
        console.log('User created!');
    });
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    loginUser
}