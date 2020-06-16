const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res) => {
    /* to be implemented */
    res.json({ success: true });
});

router.post('/login', (req, res) => {
    /* to be implemented */
    res.json({ success: true });
});

router.get('/getinfo', (req, res) => {
    res.json({ info: null });
});

router.post('/logout', (req, res) => {
    res.json({ success: true });
});

router.delete('/leave', (req, res) => {
    res.json({ success: true });
})

module.exports = router;