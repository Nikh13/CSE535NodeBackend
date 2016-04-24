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
    const onCheck = function(err,response){
        if(err){
            res.send(response);
        } 
        else {
            db.createRide(data, onInsert);
        }
    }

    const onInsert = function(err,response){
        if(err){
            res.send(response);
        } 
        else {
            res.json(response);
        }
    }

    db.checkRideTimeStamp(data, onCheck);
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

    const onCheck = function(err,response){
        if(err){
            res.send(response);
        } 
        else {
            db.createRequest(data, onInsert);
        }
    }
    db.checkRequestTimeStamp(data, onCheck);
});

router.post('/getRides/', function(req, res){
    var data = req.body.userid;

    const onRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getMyRides(data, onRequest);

});

router.post('/getRequests/:userid', function(req, res){
    var data = {userid : req.body.userid}
    

    const onRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getMyRequests(data, onRequest);

});

router.post('/getPendingRequestConfirmations', function(req, res){
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
    };

    db.getPendingApproval(user_id, onRequest);

});


router.post('/getConfirmedRequests', function(req, res){
    var user_id = req.body.user_id;
    const onGetRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getConfirmedRequests(user_id, onGetRequest);

});

router.post('/getConfirmedRides', function(req, res){
    var user_id = req.body.user_id;
    const onGetRide = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    };

    db.getConfirmedRides(user_id, onGetRide);

});

router.post('/getHistoryRequests', function(req, res){
    var user_id = req.body.user_id;
    const onGetRequest = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    }

    db.getHistoryRequests(user_id, onGetRequest);

});

router.post('/getHistoryRides', function(req, res){
    var user_id = req.body.user_id;
    const onGetRide = function(err, response){
        if(err)
            res.send(response);
        else
            res.json(response);
    };

    db.getHistoryRides(user_id, onGetRide);

});

router.post('/getAssociatedRequestDetails', function(req, res){
    var ride_id = req.body.ride_id;
    console.log("Ride ID: "+ride_id);
    var responseJSON = {};
    const onGetRequest = function(err,response){
        if(err){res.send(err);
        } else {
            responseJSON.request = response;
            console.log("Associated request: ");
            console.log(response);
            db.getUser(response.user_id,onGetProfile);
        }

    };
    const onGetProfile = function(err,response){
        if(err){res.send(err);
        } else {
            responseJSON.profile = response;
            res.json(responseJSON);
        }
    };

    db.getAssociatedRequest(ride_id, onGetRequest);

});

router.post('/getAssociatedRideDetails', function(req, res){
    var request_id = req.body.request_id;
    var responseJSON = {};
    const onGetRide = function(err,response){
        if(err){res.send(err);
        } else {
            responseJSON.ride = response;
            db.getUser(response.user_id,onGetProfile);
        }

    };
    const onGetProfile = function(err,response){
        if(err){res.send(err);
        } else {
            responseJSON.profile = response;
            res.json(responseJSON);
        }

    };

    db.getAssociatedRide(request_id, onGetRide);

});

module.exports = router;

