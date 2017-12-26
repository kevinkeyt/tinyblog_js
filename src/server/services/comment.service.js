const Comment = require('../models/comment.model');
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

module.exports = {
    getComments
};