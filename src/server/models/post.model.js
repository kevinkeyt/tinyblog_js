const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: String,
    content: String,
    postDate: { type: Date, default: Date.now },
    publishDate: {type: Date }
}, {
    collection: 'posts',
    read: 'nearest'
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;