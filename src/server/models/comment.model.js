const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    postId: String,
    user: String,
    content: String,
    createdDate: { type: Date, default: Date.now },
    published: { type: Boolean, default: true }
}, {
    collection: 'comments',
    read: 'nearest'
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;