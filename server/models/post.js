const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    writer: String,
    title: String,
    content: String,
    start: Date,
    end: Date,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('post', Post);