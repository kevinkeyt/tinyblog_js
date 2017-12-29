const express = require('express');
const router = express.Router();

const commentService = require('../services/comment.service');

router.get('/get/:id', (req, res) => {
    commentService.getComments(req, res);
});

module.exports = router;