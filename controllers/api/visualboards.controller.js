var express = require('express');
var router = express.Router();
var visualboardService = require('services/visualboard.service');
 
// routes
router.get('/', getAll);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function create(req, res) {
    //var userId = req.user.sub;
    //if (req.params._id !== userId) {
        // can only update own account
    //    return res.status(401).send('You can only update your own account');
    //}

    visualboardService.create(req.body)
        .then(function (visualboard) {
            res.status(200).send(visualboard);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
   //check if any client id recieved
   var createdBy = req.query.createdBy;
   var type = req.query.type;
   if(createdBy && type)
   {  
        visualboardService.getByUserId(createdBy, type)
       .then(function (visualboards) {
           if (visualboards) {
               res.send(visualboards);
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
        visualboardService.getAll()
       .then(function (visualboards) {
           if (visualboards) {
               res.send(visualboards);
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
    var dashbaordId = req.params._id;
   // var userId = req.user.sub;
    // if (req.params._id !== userId) {
    //     // can only update own account
    //     return res.status(401).send('You can only update your own account');
    // }

    visualboardService.getById(dashbaordId, req.body)
        .then(function (dashbaord) {
        if (dashbaord) {
            res.send(dashbaord);
        } else {
            res.sendStatus(404);
        }
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
    var dashbaordId = req.params._id;
    visualboardService.update(dashbaordId, req.body)
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
    var dashbaordId = req.params._id;
    visualboardService.delete(dashbaordId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}