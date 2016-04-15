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
        min_amt : req.body.minAmount,
        timestamp: req.body.timestamp,
        origin_address: req.body.origin_address,
        destination_address: req.body.destination_address,
        max_delay: req.body.maxDelay
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
        max_pay : req.body.maxPay,
        origin_address: req.body.origin_address,
        destination_address: req.body.destination_address,
        timestamp: req.body.timestamp
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
    var data = req.params.userid;

    const onRequest = function(err, response){
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

    const onRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getMyRequests(data, onRequest);

});

router.post('/getPendingRequestConfirmation', function(req, res){
    var user_id = req.body.user_id;

    const onRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getPendingRequestConfirmation(user_id, onRequest);

});

router.post('/getPendingApprovals', function(req, res){
    var user_id = req.body.user_id;

    const onRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getPendingApproval(user_id, onRequest);

});

module.exports = router;

