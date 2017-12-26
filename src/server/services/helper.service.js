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
    const token = req.headers.authToken;
    if(!token) {
        res.status(403).send('Invalid Token');
        return;
    }

    if(token.expiresOn <= new Date()) {
        res.status(403).send('Token Expired!');
        return;
    }
    const tokenValidation = sha512(token.id, token.expiresOn.getTime().toString());
    if(tokenValidation !== token.token) {
        res.status(403).send('Invalid Token');
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 30);
    const cryptotoken = sha512(user._id, expires.getTime().toString());
    token.expiresOn = expires;
    token.token = cryptotoken;
    return token;
}

module.exports = {
    checkServerError,
    checkFound,
    getUniqueString,
    validateToken
}