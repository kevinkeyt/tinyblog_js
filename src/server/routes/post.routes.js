const express = require('express');
const router = express.Router();

const postService = require('../services/post.service');

router.get('/get', (req, res) => {
    postService.getPosts(req, res);
});

router.get('/post/:id', (req, res) => {
    postService.getPost(req, res);
});

router.post('/post', (req, res) => {
    postService.addPost(req, res);
});

router.put('/post/:id', (req, res) => {
    postService.putPost(req, res);
});

router.delete('/post/:id', (req, res) => {
    postService.deletePost(req, res);
});

module.exports = router;