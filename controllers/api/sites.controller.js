var config = require('config.json');
var express = require('express');
var router = express.Router();
var siteService = require('services/site.service');
 
// routes
router.get('/', getAll);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function getAll(req, res) {
    //check if any client id recieved
    var organisationId = req.query.oid;
    if(organisationId)
    {  
        siteService.getAllByClientId(organisationId)
        .then(function (sites) {
            if (sites) {
                res.send(sites);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    }
    else
    {  
        siteService.getAll()
        .then(function (sites) {
            if (sites) {
                res.send(sites);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    }
}

function getById(req, res) {
    var siteId = req.params._id;
   // var userId = req.user.sub;
    // if (req.params._id !== userId) {
    //     // can only update own account
    //     return res.status(401).send('You can only update your own account');
    // }

    siteService.getById(siteId, req.body)
        .then(function (site) {
        if (site) {
            res.send(site);
        } else {
            res.sendStatus(404);
        }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    //var userId = req.user.sub;
    //if (req.params._id !== userId) {
        // can only update own account
    //    return res.status(401).send('You can only update your own account');
    //}

    siteService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    var loggedInUserId = req.user.sub;
    //if (req.params._id !== userId) {
        // can only update own account
    //    return res.status(401).send('You can only update your own account');
    //}
    var siteId = req.params._id;
    siteService.update(siteId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    var loggedInUserId = req.user.sub;
    //var userId = req.user.sub;
    //if (req.params._id !== userId) {
        // can only delete own account
    //    return res.status(401).send('You can only delete your own account');
    //}
    var siteId = req.params._id;
    siteService.delete(siteId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}