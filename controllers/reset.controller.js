var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('reset');
});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/reset',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('reset', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('reset', {
                error: response.body,
                email: req.body.email
            });
        }

        // return to login page with success message
        req.session.success = 'An email has been sent with instructions on how to reset password.';
        console.log(req.session.success);
        return res.redirect('/login');
    });
});

module.exports = router;