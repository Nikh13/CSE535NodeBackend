/**
 * Created by BrianVincent on 3/15/16.
 */

var express = require('express');
var router = express.Router();
var db = require('../database/database');



router.post('/createRide', function(req, res){
    const data = {
        user_id : req.body.userid,
        origin : req.body.origin,
        dest : req.body.dest,
        pay_type : req.body.payType,
        seats : req.body.seatsAvail,
        min_amt : req.body.minAmount
    }
    const onInsert = function(err,response){
        if(err){
            res.send(response);
        } 
        else {
            res.json(response);
        }
    }
    db.createRide(data, onInsert);
});

router.post('/createRequest', function(req, res) {
    const data = {        
        user_id : req.body.userid,
        origin : req.body.origin,
        dest : req.body.dest,
        pay_type : req.body.payType,
        max_pay : req.body.maxAmount
    }
    const onInsert = function(err,response){
        if(err){
            res.send(response);
        } 
        else {
            res.json(response);
        }
    }
    db.createRequest(data, onInsert);
});





router.get('/getRides/:userid', function(req, res){
    var userid = req.params.userid;

    cons onRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getMyRides(data, onRequest);

});

router.get('/getRequests/:userid', function(req, res){
    var data = {
        userid : req.params.userid
    }

    cons onRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getMyRequests(data, onRequest);

});










module.exports = router;

