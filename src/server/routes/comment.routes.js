const express = require('express');
const router = express.Router();

const commentService = require('../services/comment.service');

router.get('/get/:id', (req, res) => {
    commentService.getComments(req, res);
});

router.post('/comment', (req, res) => {
    commentService.addComment(req, res);
});

router.put('/comment/:id', (req, res) => {
    commentService.updateComment(req, res);
});

router.delete('/comment/:id', (req, res) => {
    commentService.deleteComment(req, res);
});

module.exports = router;