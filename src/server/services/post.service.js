const Post = require('../models/post.model');
const helpers = require('../services/helper.service');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function getPosts(req, res) {
    const docquery = Post.find({}).read(ReadPreference.NEAREST);
    docquery.exec()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).send(error);
    });
}

function addPost(req, res) {
    const originalPost = { id: req.body.id, title: req.body.title, content: req.body.content, publishDate: req.body.publishDate };
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
  const originalPost = {
    id: req.params.id,
    title: req.body.name,
    content: req.body.saying,
    publishDate: req.body.publishDate
  };
  Post.findOne({ id: originalPost.id }, (error, post) => {
    if (helpers.checkServerError(res, error)) return;
    if (!helpers.checkFound(res, post)) return;

    post.name = originalPost.name;
    post.title = originalPost.title;
    post.content = originalPost.content;
    post.publishDate = originalPost.publishDate;
    post.save(error => {
      if (helpers.checkServerError(res, error)) return;
      res.status(200).json(post);
      console.log('Post updated successfully!');
    });
  });
}

function deletePost(req, res) {
  const id = req.params.id;
  Post.findOneAndRemove({ id: id })
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
    addPost,
    putPost,
    deletePost
};