var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
 
// routes
router.post('/authenticate', authenticateUser);
router.get('/current', getCurrentUser);
router.post('/reset', resetUser);
router.get('/', getAllUsers);
router.get('/:_id', getUserById);
router.post('/', createUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.email, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Email or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function resetUser(req, res) {
    //userService.create(req.body)
       // .then(function () {
            res.sendStatus(200);
      //  })
      //  .catch(function (err) {
       //     res.status(400).send(err);
      //  });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllUsers(req, res) {
    var organisationId = req.query.oid;
    if(organisationId)
    {
        userService.getAllByClientId(organisationId)
            .then(function (users) {
                if (users) {
                    res.send(users);
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
        userService.getAll()
        .then(function (users) {
            if (users) {
                res.send(users);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });  
    }
}

function getUserById(req, res) {
    var userId = req.params._id;
   // var userId = req.user.sub;
    // if (req.params._id !== userId) {
    //     // can only update own account
    //     return res.status(401).send('You can only update your own account');
    // }

    userService.getById(userId, req.body)
        .then(function (user) {
        if (user) {
            res.send(user);
        } else {
            res.sendStatus(404);
        }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var loggedInUserId = req.user.sub;
    //if (req.params._id !== userId) {
        // can only update own account
    //    return res.status(401).send('You can only update your own account');
    //}
    var userId = req.params._id;
    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createUser(req, res) {
    //var userId = req.user.sub;
    //if (req.params._id !== userId) {
        // can only update own account
    //    return res.status(401).send('You can only update your own account');
    //}

    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var loggedInUserId = req.user.sub;
    //var userId = req.user.sub;
    //if (req.params._id !== userId) {
        // can only delete own account
    //    return res.status(401).send('You can only delete your own account');
    //}
    var userId = req.params._id;
    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}