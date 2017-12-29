const crypto = require('../services/crypto.service');

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
    var token = req.headers['authtoken'];
    if(!token) {
        res.status(403).send('Invalid Token');
        return;
    }
    token = JSON.parse(token);

    if(token.expiresOn <= new Date()) {
        res.status(403).send('Token Expired!');
        return;
    }
    var expires = new Date(token.expiresOn);
    const tokenValidation = crypto.sha512(token.id, expires.getTime().toString());
    if(tokenValidation !== token.token) {
        res.status(403).send('Invalid Token');
        return;
    }
    return token;
}

module.exports = {
    checkServerError,
    checkFound,
    getUniqueString,
    validateToken
}