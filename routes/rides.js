/**
 * Created by BrianVincent on 3/15/16.
 */

var express = require('express');
var router = express.Router();
var db = require('../database/database');


router.post('/createProvide', function(req, res){
    const data = {
        user_id : req.body.userid,
        origin : req.body.startDest,
        dest : req.body.endDest,
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


router.post('/createRequester', function(req, res) {
    const data = {        
        user_id : req.body.userid,
        origin : req.body.startDest,
        dest : req.body.endDest,
        pay_type : req.body.payType,
        max_pay : req.body.maxPay
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




module.exports = router;

