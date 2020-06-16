const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const User = new Schema({
    userid: String,
    password: String,
    nickname: String,
    created: { type: Date, default: Date.now }
});

User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSalt(10));
};

User.methods.validateHash = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', User);