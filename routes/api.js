/**
 * Created by Nikhil on 3/8/16.
 * Contributors:
 *  Brian Vincent
 */

var express = require('express');
var router = express.Router();
var db = require('../database/database');

/* GET home page. */
router.post('/newuser', function(req, res) {
    const data = {
        uname: req.body.username,
        pwd: req.body.password,
        name: req.body.name,
        email: req.body.email,
        phno: req.body.phno
    }
    const onInsert = function(err,response){
        if(err){res.send(response);
        } else {
            res.json(response);
        }

    }
    db.insert(data,onInsert);
});

router.post('/getProfile', function(req, res) {
    const data = {
        user_id: req.body.userid
    }
    const onGet = function(err,response){
        if(err){res.send(response);
        } else {
            res.json(response);
        }

    }
    db.getUser(data,onGet);
});

router.post('/login', function(req, res) {
    const data = {
        uname: req.body.username,
        pwd: req.body.password
    }
    const onGet = function(err,response){
        if(err){res.send(response);
        } else {
            res.json(response);
        }

    }
    db.getUID(data,onGet);
});

router.get('/PayType/:payTypeId', function(req, res) {
    const data = req.params.payTypeId;

    const onGet = function(err,response){
        if(err){res.send(response);
        } else {
            res.json(response);
        }
    }
    db.getPayType(data,onGet);
});




module.exports = router;

