const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const crypto = require('../services/crypto.service');
const helpers = require('../services/helper.service');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function getUsers(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }

    const docquery = User.find({}).read(ReadPreference.NEAREST);
    docquery.exec()
    .then(users => {
        return res.status(200).json(users);
    })
    .catch(error => {
        return res.status(500).send(error);
    });
}

function getUser(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }

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

function reissueToken(req, res) {
    var token = helpers.validateToken(req, res);
    var expires = new Date();
    expires.setMinutes(expires.getMinutes() + 30);
    const cryptotoken = crypto.sha512(token.id, expires.getTime().toString());
    token.expiresOn = expires;
    token.token = cryptotoken;
    res.status(200).send(token);
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
            var token = jwt.sign({
                agen: req.headers['user-agent'],
                exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60
            }, 'dkd94kdkd*dkdk!');
            
            const payload = {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: token
            };
            res.status(200).json(payload);
        } else {
            res.status(403).send('Invalid Login!');
        }
    });
}

function addUser(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }
    User.findOne({ email: req.body.email }, (error, item) => {
        if(item) {
            res.status(409).send('Email already exists!');
            return;
        }
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
            res.status(200).json(user);
            console.log('User created!');
        });
    });
}

function putUser(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }
    User.findOne({ email: req.body.email}, (error, check) => {
        if (helpers.checkServerError(res, error)) return;
        if(check && check._id.toString() !== req.params.id) {
            res.status(500).send('Email is already in use!');
            return;
        }
        User.findOne({ _id: req.params.id }, (error, user) => {
            if (helpers.checkServerError(res, error)) return;
            if (!helpers.checkFound(res, user)) return;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.save(error => {
                if(helpers.checkServerError(res, error)) {
                    return;
                }
                res.status(200).json(user);
            });
        });
    });
}

function deleteUser(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }
    const id = req.params.id;
    User.findOneAndRemove({ _id: id}).then(user => {
        if(!helpers.checkFound(res, user)) {
            return;
        }
        res.status(200).json(user);
        console.log('User deleted successfully!');
    })
    .catch(error => {
        if(helpers.checkServerError(res, error)) {
            return;
        }
    });
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    putUser,
    deleteUser,
    loginUser,
    reissueToken
}