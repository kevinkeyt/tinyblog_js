const express = require('express');
const router = express.Router();

const postService = require('../services/post.service');

router.get('/get', (req, res) => {
    postService.getPosts(req, res);
});

module.exports = router;