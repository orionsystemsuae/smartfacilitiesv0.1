var express = require('express');
var router = express.Router();

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
    }
    next();
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
    if (req.session.token)
        res.send(req.session.token);
    else
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
});

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;