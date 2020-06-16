const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    title: String,
    content: String,
    date: Date,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('post', Post);