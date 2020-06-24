const express = require('express');
const Post = require('../models/post');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(__dirname)
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        // let temp = 'image';
        let fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
        if (typeof req.session.loginInfo !== 'undefined') //로그인 안하면 cb() 호출안해서 저장 안되는 듯..
            cb(null, req.session.loginInfo.userid + '-' + Date.now() + fileExtension)
    }
});

const upload = multer({ storage: storage });

router.post('/new-post', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }

    req.body.deletedFiles.forEach(file => {
        fs.unlink('.' + file, err => {
            if (err) throw err;

            console.log("File deleted: " + file);
        })
    })

    const post = new Post({
        writer: req.session.loginInfo.userid,
        title: req.body.post.title,
        content: req.body.post.content,
        color: req.body.post.color,
        start: new Date(req.body.post.start),
        end: new Date(req.body.post.end),
        files: req.body.post.files
    });

    post.save((err, post) => {
        if (err) throw err;

        res.json({ id: post._id });
    })
});

router.post('/new-resource', upload.single('file'), (req, res) => {
    // res.send('Uploaded!: '+req.file);

    res.json({ fileURL: 'upload/' + req.file.filename });
});

router.get('/my-posts', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }

    Post.find(
        {
            $and: [
                { writer: req.session.loginInfo.userid },
                {
                    start: {
                        $lte: req.query.end,
                    }
                },
                {
                    end: {
                        $gte: req.query.start
                    }
                }
            ]
        },
        { content: false, files: false })
        .sort({ start: 1 })
        .exec((err, posts) => {
            if (err) throw err;

            res.json({ list: posts });
        });
});

router.get('/:id', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    };

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID POST ID",
            code: 2
        });
    };

    Post.findById(req.params.id, (err, post) => {
        if (err) throw err;

        res.json({ post });
    });
});

router.put('/:id', (req, res) => {

    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    };

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID POST ID",
            code: 2
        });
    };

    req.body.deletedFiles.forEach(file => {
        fs.unlink('.' + file, err => {
            if (err) throw err;

            console.log("File deleted: " + file);
        })
    })

    const post = {
        ...req.body.post,
        start: new Date(req.body.post.start),
        end: new Date(req.body.post.end),
    }

    Post.updateOne({ _id: req.params.id }, post, (err, post) => {
        if (err) throw err;

        res.json({ success: true });
    })
});

router.delete('/:id', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    };

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID POST ID",
            code: 2
        });
    };

    Post.findOneAndDelete({ _id: req.params.id }, (err, post) => {
        if (err) throw err;

        post.files.forEach(file => {
            fs.unlink('.' + file, err => {
                if (err) throw err;

                console.log("File deleted: " + file);
            });
        })

        res.json({ success: true })
    });
});


module.exports = router;