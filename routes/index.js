const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated,
 (req, res) => res.render('Dashboard', {
    name: req.user.name
    }));

module.exports = router;