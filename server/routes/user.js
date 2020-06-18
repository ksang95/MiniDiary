const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res) => {
    let pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/;

    if (!pwRegex.test(req.body.user.password)) {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 1
        });
    }

    User.findOne({ userid: req.body.user.userid }, (err, user) => {
        if (err) throw err;

        if (user)
            return res.status(409).json({
                error: "ID EXISTS",
                code: 2
            });
    });

    let user=new User({
        ...req.body.user
    });

    user.password=user.generateHash(user.password);

    user.save(err=>{
        if(err) throw err;

        req.session.loginInfo = {
            _id: user._id,
            userid: user.userid,
            nickname: user.nickname
        }

        res.json({ success: true });
    });
});

router.post('/login', (req, res) => {
    User.findOne({ userid: req.body.userid }, (err, user) => {
        if (err) throw err;

        if (!user || !user.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        req.session.loginInfo = {
            _id: user._id,
            userid: user.userid,
            nickname: user.nickname
        }

        res.json({ success: true });
    })
});

router.get('/info', (req, res) => {
    if (typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

router.post('/logout', (req, res) => {
    res.json({ success: true });
});

router.delete('/leave', (req, res) => {
    res.json({ success: true });
})

module.exports = router;