const express = require('express');
const Post = require('../models/post');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const router = express.Router();
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2'
});
const bucket = process.env.S3_BUCKET_NAME;
const storage = multerS3({
    s3: s3,
    bucket: bucket + '/upload',
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        console.log(bucket)
        let fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
        //로그인 안 했을 때 cb()만 작동안하면 파일 업로드 안되는 것 같다.
        if (typeof req.session.loginInfo !== 'undefined')
            cb(null, req.session.loginInfo.userid + '-' + Date.now() + fileExtension)
    }
})

const upload = multer({ storage: storage });

router.post('/new-post', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(401).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }


    req.body.deletedFiles.forEach(file => {
        const params = {
            Bucket: bucket + '/upload',
            Key: file
        };

        s3.deleteObject(params, (err, data) => {
            if (err) throw err;

            console.log(data)
        });
    });

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
    res.json({
        fileURL: req.file.location,
        fileName: req.file.key
    });
});

router.get('/my-posts', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(401).json({
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
        return res.status(401).json({
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

        if (post.writer !== req.session.loginInfo.userid) {
            return res.status(403).json({
                error: "UNAUTHORIZED",
                code: 3
            })
        }

        res.json({ post });
    });
});

router.put('/:id', (req, res) => {

    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(401).json({
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
        const params = {
            Bucket: bucket + '/upload',
            Key: file
        };

        s3.deleteObject(params, (err, data) => {
            if (err) throw err;

            console.log(data)
        });
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
        return res.status(401).json({
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
            const params = {
                Bucket: bucket + '/upload',
                Key: file
            };

            s3.deleteObject(params, (err, data) => {
                if (err) throw err;

                console.log(data)
            });
        });

        res.json({ success: true });
    });
});


module.exports = router;