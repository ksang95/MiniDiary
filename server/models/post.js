const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    writer: String,
    title: String,
    content: String,
    color: String,
    start: Date,
    end: Date,
    files: [String],
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('post', Post);