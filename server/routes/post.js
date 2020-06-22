const express = require('express');
const Post = require('../models/post');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/')
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

    req.body.deletedImages.forEach(image => {
        fs.unlink(image, err => {
            if (err) throw err;
            console.log("Image deleted: " + image);
        })
    })

    const post = new Post({
        writer: req.session.loginInfo.userid,
        title: req.body.post.title,
        content: req.body.post.content,
        color: req.body.post.color,
        start: new Date(req.body.post.start),
        end: new Date(req.body.post.end),
    });

    post.save((err, post) => {
        if (err) throw err;

        res.json({ id: post._id });
    })
});

router.post('/new-post/resource', upload.single('images'), (req, res) => {
    // res.send('Uploaded!: '+req.file);
    console.log(req.file);

    res.json({ fileURL: '/upload/' + req.file.filename });
});

router.get('/my-posts', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }

    console.log(req.query)
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
        { content: false })
        .sort({ start: 1 })
        .exec((err, posts) => {
            if (err) return err;
            console.log(posts)
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
        if (err) return err;

        res.json({ post });
    });
});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id/resource', (req, res) => {

});

module.exports = router;