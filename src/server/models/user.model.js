const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    salt: String,
    createdOn: { type: Date, default: Date.now },
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    lastLogin: Date
}, {
    collection: 'users',
    read: 'nearest'
});
const User = mongoose.model('User', userSchema);
module.exports = User;