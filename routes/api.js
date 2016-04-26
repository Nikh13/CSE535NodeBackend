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
var gcm = require('node-gcm');


/* GET home page. */
router.post('/newuser', function (req, res) {
    var responseJSON;
    const data = {
        uname: req.body.username,
        pwd: req.body.password,
        name: req.body.name,
        email: req.body.email,
        phno: req.body.phno
    }
    const onInsert = function (err, response) {
        if (err) {
            res.send(response);
        } else {
            var device_token = req.body.device_token;
            if (device_token == null) {
                res.json(response);
            } else {
                responseJSON = response;
                response.device_token = device_token;
                db.updatedDeviceId(response, onUpdate);
            }
        }
    }

    const onUpdate = function (err, response) {
        if (err) {
            res.send(response);
        } else {
            res.json(responseJSON);
        }

    }
    db.insert(data, onInsert);
});

router.post('/getProfile', function (req, res) {
    var user_id = req.body.userid
    const onGet = function (err, response) {
        if (err) {
            res.send(response);
        } else {
            res.json(response);
        }

    }
    db.getUser(user_id, onGet);
});

router.post('/login', function (req, res) {
    const data = {
        uname: req.body.username,
        pwd: req.body.password
    }
    var responseJSON;
    const onGet = function (err, response) {
        if (err) {
            res.send(response);
        } else {
            var device_token = req.body.device_token;
            if (device_token == null) {
                res.json(response);
            } else {
                responseJSON = response;
                response.device_token = device_token;
                db.updatedDeviceId(response, onUpdate);
            }
        }

    }
    const onUpdate = function (err, response) {
        if (err) {
            res.send(response);
        } else {
            res.json(responseJSON);
        }

    }

    db.getUID(data, onGet);
});

router.post('/getPossibleRoutes', function (req, res) {
    const config = {
        "key": "AIzaSyC9brE2MDidqiMgvQXeQNRPgAb_nPCxRP0",
        "secure": true
    };
    var gm = new map(config);
    const ride_id = req.body.ride_id;
    var ride;
    var rideDetails;
    var finalRequestList = [];
    var requestList = [];
    var paramsList = [];
    var count = 0;

    const onGetRide = function (err, response) {
        if (err) {
            res.send(response);
        } else {
            ride = response;
            var params = {
                origin: ride.origin,
                destination: ride.destination
            };
            gm.directions(params, onGetRideDirections);
            db.getRequests(onGetRequests);
        }

    }

    const onGetRequests = function (err, result) {
        if (err) {
            res.send(result);
        } else {
            for (var i = 0; i < result.length; i++) {
                var request = result[i];
                if (ride.user_id == request.user_id || request.pay_type != ride.pay_type || request.max_payment < ride.min_payment) {
                    continue;
                }
                var params = {
                    origin: ride.origin,
                    destination: ride.destination,
                    waypoints: "" + request.origin + "|" + request.destination
                };
                requestList.push(request);
                paramsList.push(params);
            }
            if (requestList.length == 0) {
                res.json(requestList);
                return;
            }
            for (var i = 0; i < requestList.length; i++) {
                gm.directions(paramsList[i], onGetRequestDirections);
            }
        }

    }

    const onGetRideDirections = function (err, result) {
        if (err) {
            res.send("Some error");
        } else {
            rideDetails = computeTotalDistance(result);
        }
    }
    const onGetRequestDirections = function (err, result) {
        if (err) {
            res.send(result);
        } else {
            var request = requestList[count];
            var result = computeTotalDistance(result);
            if (ride.max_delay == -1 || result.duration - rideDetails.duration <= ride.max_delay) {
                request.duration = result.duration;
                request.distance = result.distance;
                request.delay = result.duration - rideDetails.duration;
                finalRequestList.push(request);
            }
        }
        if (requestList.length == 0) {
            res.json(requestList);
            return;
        }
        if (count == requestList.length - 1)
            res.json(finalRequestList);
        count++;
    }

    db.getRide(ride_id, onGetRide)
});

router.post('/selectRequest', function (req, res) {
    var ride_id = req.body.ride_id;
    var user_id = req.body.user_id;
    var requester_id = req.body.requester_id;
    var request_id = req.body.request_id;

    const data = {
        ride_id: ride_id,
        user_id: user_id,
        requester_id: requester_id,
        request_id: request_id
    };

    const onSelect = function (err, result) {
        if (err) {
            res.send(result);
        } else {
            db.getGCMData(data, onGetData);
        }
    };

    const onGetData = function (err, result) {
        if (err) {
            res.send(result);
        } else {
            var registrationTokens = [result.device_token];
            sendGCMMessage(registrationTokens, result, onSend);
        }
    };

    const onSend = function (err, result) {
        if (err) {
            res.send(result);
        } else {
            res.json(result);
        }
    }

    db.insertConfirmation(data, onSelect)

});

router.post('/confirmRide', function (req, res) {
    var data = req.body.ride_id;

    const onConfirm = function (err, result) {
        if (err) {
            res.send(err + " " + result);
        } else {
            res.json(result);
        }
    };

    db.confirmRide(data, onConfirm)

});

router.post('/completeRide', function (req, res) {
    var data = {
        ride_id: req.body.ride_id,
        rating: req.body.rating || -1,
        user_id: req.body.user_id
    };
    console.log("Rating: " + data.rating);
    const onComplete = function (err, result) {
        if (err) {
            res.send(err + " " + result);
        } else {
            if (data.rating == -1) {
                res.json(result);
            } else {
                console.log("With rating");
                db.updateRating(data, onUpdate);
            }
        }
    };

    const onUpdate = function (err, result) {
        if (err) {
            res.send(err + " " + result);
        } else {
            res.json(result);
        }
    };

    db.completeRide(data, onComplete);

});

router.get('/PayType/:payTypeId', function (req, res) {
    const data = req.params.payTypeId;

    const onGet = function (err, response) {
        if (err) {
            res.send(response);
        } else {
            res.json(response);
        }
    }
    db.getPayType(data, onGet);
});

router.post('/getRide', function (req, res) {
    var error = {};
    var responseJSON = {};
    var ride_id = req.body.ride_id;
    const onGetRide = function (err, response) {
        if (err) {
            error.status = true;
            error.message = response
        } else {
            responseJSON.ride = response;
            db.getUser(response.user_id, onGetProfile);
        }

    }
    const onGetProfile = function (err, response) {
        if (err) {
            res.send(err);
        } else {
            console.log(response);
            responseJSON.profile = response;
            res.json(responseJSON);
        }

    }
    db.getRide(ride_id, onGetRide);
});

router.post('/getRequest', function (req, res) {
    var responseJSON = {};
    var request_id = req.body.request_id;
    const onGetRequest = function (err, response) {
        if (err) {
            res.send(err);
        } else {
            responseJSON.request = response;
            db.getUser(response.user_id, onGetProfile);
        }

    }
    const onGetProfile = function (err, response) {
        if (err) {
            res.send(err);
        } else {

            responseJSON.profile = response;
            res.json(responseJSON);
        }

    }
    db.getRequest(request_id, onGetRequest);
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
    var duration = (totalTime / 60);
    console.log("total distance is: " + totalDist + " km total time is: " + (totalTime / 60).toFixed(2) + " minutes");
    return {distance: totalDist, duration: duration};
}

function sendGCMMessage(registrationTokens, data, callback) {
    var message = new gcm.Message();
    message.addData(data);
    var sender = new gcm.Sender('AIzaSyCOmOB73XYVLVuztQDRWs_6vYBM6oa_Q3E');

// Now the sender can be used to send messages
    sender.send(message, {registrationTokens: registrationTokens}, function (err, response) {
        if (err) callback(true, {error: "GCM Sending Error " + response});
        else    callback(false, {status: "success: ", response: response});
    });
}

