const Post = require('../models/post.model');
const helpers = require('../services/helper.service');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function getPosts(req, res) {
    const docquery = Post.find({}).sort({ publishDate: 'desc' }).read(ReadPreference.NEAREST);
    docquery.exec()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).send(error);
    });
}

function getPost(req, res) {
    Post.findOne({ _id: req.params.id }, (error, post) => {
        if(helpers.checkServerError(res, error)) {
            return;
        }
        if(!helpers.checkFound(res, post)) {
            return;
        }
        return res.status(200).json(post);
    });
}

function addPost(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }
    const originalPost = { title: req.body.title, content: req.body.content, publishDate: req.body.publishDate };
    const post = new Post(originalPost);
    post.save(error => {
        if (helpers.checkServerError(res, error)) {
            return;
        }
        res.status(201).json(post);
        console.log('Post created!');
    });
}

function putPost(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }

    Post.findOne({ _id: req.params.id }, (error, post) => {
        if (helpers.checkServerError(res, error)) return;
        if (!helpers.checkFound(res, post)) return;

        post.title = req.body.title;
        post.content = req.body.content;
        post.publishDate = req.body.publishDate;
        post.save(error => {
        if (helpers.checkServerError(res, error)) return;
        res.status(200).json(post);
        console.log('Post updated successfully!');
        });
    });
}

function deletePost(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }
    Post.findOneAndRemove({ _id: req.params.id })
    .then(post => {
      if (!helpers.checkFound(res, post)) return;
      res.status(200).json(post);
      console.log('Post deleted successfully!');
    })
    .catch(error => {
      if (helpers.checkServerError(res, error)) return;
    });
}

module.exports = {
    getPosts,
    getPost,
    addPost,
    putPost,
    deletePost
};