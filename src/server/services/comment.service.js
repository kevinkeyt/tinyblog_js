const Comment = require('../models/comment.model');
const helpers = require('../services/helper.service');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function getComments(req, res) {
    const docquery = Comment.find({ postId: req.params.id }).read(ReadPreference.NEAREST);
    docquery.exec()
    .then(comments => {
        res.status(200).json(comments);
    })
    .catch(error => {
        res.status(500).send(error);
    });
}

function addComment(req, res) {
    const comment = {
        postId: req.body.postId,
        user: req.body.user,
        content: req.body.content
    };
    const c = new Comment(comment);
    c.save(error => {
        if(helpers.checkServerError(res, error)) {
            return;
        }
        res.status(201).json(c);
        console.log('Comment created!');
    });
}

function updateComment(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }

    Comment.findOne({ _id: req.params.id }, (error, comment) => {
        if (helpers.checkServerError(res, error)) return;
        if (!helpers.checkFound(res, comment)) return;

        comment.postId = req.body.postId || comment.postId;
        comment.content = req.body.content || comment.content;
        comment.user = req.body.user || comment.user;
        comment.published = req.body.published || comment.published;
        comment.save(error => {
            if (helpers.checkServerError(res, error)) return;
            res.status(200).json(comment);
            console.log('Comment updated successfully!');
        });
    });
}

function deleteComment(req, res) {
    if(!helpers.validateToken(req, res)) {
        return;
    }
    Comment.findOneAndRemove({ _id: req.params.id })
        .then(comment => {
            if (!helpers.checkFound(res, comment)) return;
            res.status(200).json(comment);
            console.log('Comminet deleted successfully!');
        })
        .catch(error => {
            if (helpers.checkServerError(res, error)) return;
        });
}

module.exports = {
    getComments,
    addComment,
    updateComment,
    deleteComment
};