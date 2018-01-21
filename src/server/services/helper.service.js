
const crypto = require('../services/crypto.service');
const jwt = require('jsonwebtoken');

function checkServerError(res, error) {
    if (error) {
        res.status(500).send(error);
        return error;
    }
}

function checkFound(res, item) {
    if (!item) {
        res.status(404).send('Not found!');
        return;
    }
    return item;
}

function getUniqueString() {
    return new Date().getTime().toString();
}

function validateToken(req, res) {
    var token = req.headers.authorization;
    try {
        var decoded = jwt.verify(token,'dkd94kdkd*dkdk!');
    } catch(e) {
        res.status(403).json({ status: false, msg: (e.message) ? e.message : e });
        return;
    }
    if(!decoded) {
        res.status(403).json({ status: false, msg: 'Invalid Token' });
        return;
    } else {
        return decoded;
    }
}

module.exports = {
    checkServerError,
    checkFound,
    getUniqueString,
    validateToken
}