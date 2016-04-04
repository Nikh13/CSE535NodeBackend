/**
 * Created by Nikhil on 3/8/16.
 */

var express = require('express');
var router = express.Router();
var db = require('../database/database');
var map = require('googlemaps')

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
    const params = {
        origin: req.body.origin,
        destination: req.body.destination,
        waypoints:req.body.waypoints
    };

    const onGet = function(err,result){
        if(err){res.send("Some error");
        } else {
            computeTotalDistance(result);
            res.json(result);
        }
    }
    gm.directions(params,onGet);
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
    console.log("total distance is: " + totalDist + " km total time is: " + (totalTime / 60).toFixed(2) + " minutes");
}

function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

