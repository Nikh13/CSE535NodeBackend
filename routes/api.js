/**
 * Created by Nikhil on 3/8/16.
 * Contributors:
 *  Brian Vincent
 */

var express = require('express');
var router = express.Router();
var db = require('../database/database');
var map = require('googlemaps');
var async = require('async');

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

router.post('/getPossibleRoutes', function(req,res) {
   const config = {
       "key":"AIzaSyC9brE2MDidqiMgvQXeQNRPgAb_nPCxRP0",
       "secure":true};
    var gm = new map(config);
    const ride_id = req.body.ride_id;
    var ride;
    var rideDetails;
    var finalRequestList = [];
    var paramsList = [];
    var count = 0;

    const onGetRide = function(err,response){
        if(err){res.send(response);
        } else {
            ride = response;
            var params = {
                origin: ride.origin,
                destination: ride.destination
            };
            gm.directions(params,onGetRideDirections);
            db.getRequests(onGetRequests);
        }

    }

    const onGetRequests = function(err,result){
        if(err){res.send(result);
        } else {
            for(var i=0;i<result.length;i++){
                request = result[i];
                if(request.pay_type!=ride.pay_type||request.max_payment<ride.min_payment){
                    continue;
                }
                finalRequestList.push(request);
                paramsList.push({
                    origin: ride.origin,
                    destination: ride.destination,
                    waypoints:""+request.origin+"|"+request.destination
                });
            }
            for(var i=0;i<paramsList.length;i++){
                var params = paramsList[i];
                console.log(params);
                gm.directions(params,onGetRequestDirections);
            }
        }

    }

    function getFun(val){
        return function(callback){

            callback(null,true);
        };
    }

    const onGetRideDirections = function(err,result){
        if(err){res.send("Some error");
        } else {
            rideDetails = computeTotalDistance(result);
        }
    }
    const onGetRequestDirections = function(err,result){
        count++;
        if(err){
        } else {
            var result = computeTotalDistance(result);
            if(ride.max_delay==-1 || result.duration-rideDetails.duration<=ride.max_delay){
                finalRequestList[finalRequestList.length-1].duration=result.duration;
                finalRequestList[finalRequestList.length-1].distance=result.distance;
            }
            else {
                finalRequestList.pop();
            }
        }
        if(count==paramsList.length)
            res.json(finalRequestList);
    }

    db.getRide(ride_id,onGetRide)
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

function computeTotalDistance(result) {
    var totalDist = 0;
    var totalTime = 0;
    var myroute = result.routes[0];
    for (i = 0; i < myroute.legs.length; i++) {
        totalDist += myroute.legs[i].distance.value;
        totalTime += myroute.legs[i].duration.value;
    }
    totalDist = totalDist / 1000.
    var duration = (totalTime / 60).toFixed(2);
    console.log("total distance is: " + totalDist + " km total time is: " + (totalTime / 60).toFixed(2) + " minutes");
    return {distance:totalDist,duration:duration};
}

function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

