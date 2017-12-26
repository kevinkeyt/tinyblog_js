const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');

router.get('/get', (req, res) => {
    userService.getUsers(req, res);
});

router.get('/user/:id', (req, res) => {
    userService.getUser(req, res);
});

router.post('/user', (req, res) => {
    userService.addUser(req, res);
});

router.post('/login', (req, res) => {
    userService.loginUser(req, res);
});

module.exports = router;