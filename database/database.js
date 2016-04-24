/**
 * Created by Nikhil on 3/8/16.
 * Contributors:
 *  Brian Vincent
 */

var pg = require('pg');
var uuid = require('node-uuid');
var conString = "postgres://nloney:Lamborghin_1303@cse535project.cqy72sigk86g.us-west-2.rds.amazonaws.com:5432/cse535";


var connect = function (callback) {
    var client = new pg.Client(conString);
    client.connect(function (err) {
        if (err) {
            callback(true, null, "Error connecting");
        } else {
            callback(null, client, null);
        }
    })
};

exports.insert = function (data, callback) {
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            var uid = uuid.v4();
            client.query("INSERT INTO users(user_id,username,password,name,email,phno) values($1,$2,$3,$4,$5,$6)",
                [uid, data.uname, data.pwd, data.name, data.email, data.phno], function (err, result) {
                    if (err) {
                        callback(true, "Insert error: " + err);
                    } else {
                        callback(false, {user_id: uid, name: data.name, email: data.email});
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.getUser = function (user_id, callback) {
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id,username,name,email,phno, rating_total, rating_count FROM users WHERE user_id = $1",
                [user_id], function (err, result) {
                    if (err) {
                        callback(true, "Get error: " + err);
                    } else {
                        var queryResults = result.rows;
                        callback(false, queryResults[0]);
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.getUID = function (data, callback) {
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id, name, email FROM users where username=$1 AND password=$2",
                [data.uname, data.pwd], function (err, result) {
                    if (err) {
                        callback(true, {error: "Get error: " + err});
                    } else {
                        if (result.rows.length > 0)
                            callback(false, {
                                user_id: result.rows[0].user_id,
                                name: result.rows[0].name,
                                email: result.rows[0].email
                            });
                        else
                            callback(false, {error: "Invalid username/password"});
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.createRide = function (data, callback) {
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            var ride_id = uuid.v4();
            client.query("INSERT INTO rides(ride_id,user_id,origin,destination,seats,pay_type,min_payment,max_delay,origin_address,dest_address,ts) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
                [ride_id, data.user_id, data.origin, data.dest, data.seats, data.pay_type, data.min_amt, data.max_delay, data.origin_address, data.destination_address, data.timestamp], function (err, result) {
                    if (err) {
                        callback(true, "New Ride error: " + err);
                    }
                    else {
                        callback(false, {status: "success"});
                    }
                    client.end();

                });
        }
    }

    connect(onConnect)
}

exports.createRequest = function (data, callback) {
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            var request_id = uuid.v4();
            client.query("INSERT INTO requests(request_id,user_id,origin,destination,pay_type,max_payment,origin_address,dest_address,ts) values($1,$2,$3,$4,$5,$6,$7,$8,$9)",
                [request_id, data.user_id, data.origin, data.dest, data.pay_type, data.max_pay, data.origin_address, data.destination_address, data.timestamp], function (err, result) {
                    if (err) {
                        callback(true, "New Request error: " + err);
                    }
                    else {
                        callback(false, {status: "success"});
                    }
                    client.end();

                });
        }
    }

    connect(onConnect)
}


exports.checkRideTimeStamp = function(data, callback){

    const onConnect = function(err, client, message){
        if (err){
            callback(true, message)
        }
        else{
            client.query("SELECT ts FROM rides WHERE user_id = $1 ", [data.user_id], function(err, result){
                if (err){
                    callback(true, {error : "Database error: " + err})
                }
                else{
                    var user_date = new Date(parseInt(data.timestamp));
                    var user_year = user_date.getYear();
                    var user_month = user_date.getMonth();
                    var user_day = user_date.getDay();
                    var results = [];
                    var queryResults = result.rows;
                    for (var ii = 0; ii < queryResults.length; ii++) {
                        var returned = parseInt(queryResults[ii].ts);
                        var date = new Date(returned);
                        var year = date.getYear();
                        var month = date.getMonth();
                        var day = date.getDay();

                        if ((user_year==year) && (user_month==month) && (user_day==day)){
                            callback(true, {error: "Duplicate Time Error!"});
                        }
                        else{
                            callback(false, data);
                        }
                    }
                }
                client.end();
            });
        }
    }
    connect(onConnect);

}

exports.checkRequestTimeStamp = function(data, callback){

    const onConnect = function(err, client, message){
        if (err){
            callback(true, message)
        }
        else{
            client.query("SELECT ts FROM requests WHERE user_id = $1 ", [data.user_id], function(err, result){
                if (err){
                    callback(true, {error : "Database error: " + err})
                }
                else{
                    var user_date = new Date(parseInt(data.timestamp));
                    var user_year = user_date.getYear();
                    var user_month = user_date.getMonth();
                    var user_day = user_date.getDay();
                    var results = [];
                    var queryResults = result.rows;
                    for (var ii = 0; ii < queryResults.length; ii++) {
                        var returned = parseInt(queryResults[ii].ts);
                        var date = new Date(returned);
                        var year = date.getYear();
                        var month = date.getMonth();
                        var day = date.getDay();

                        if ((user_year==year) && (user_month==month) && (user_day==day)){
                            callback(true, {error: "Duplicate Time Error!"});
                        }
                        else{
                            callback(false, data);
                        }
                    }
                }
                client.end();
            });
        }
    }
    connect(onConnect);

}

exports.getMyRides = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id, ride_id, origin, destination, seats, pay_type, min_payment,ts,max_delay,dest_address,origin_address FROM rides r WHERE user_id = $1 AND NOT EXISTS(SELECT 1 FROM confirmations c WHERE r.ride_id=c.ride_id))",
                [data], function (err, result) {
                    if (err) {
                        callback(true, "Get error: " + err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for (var i = 0; i < queryResults.length; i++) {
                            results.push(queryResults[i]);
                        }
                        callback(false, results);
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.getRide = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id,ride_id,origin, destination, seats, pay_type, min_payment,ts,max_delay,dest_address,origin_address FROM rides WHERE ride_id = $1",
                [data], function (err, result) {
                    if (err) {
                        callback(true, {error:"Get error: " + err});
                    } else {
                        var queryResults = result.rows;
                        console.log(queryResults);
                        var results = queryResults[0];
                        console.log(results);
                        callback(false, results);
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.getAssociatedRide = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.user_id,r.ride_id,r.origin, r.destination, r.seats, r.pay_type, r.min_payment,r.ts,r.max_delay,r.dest_address,r.origin_address FROM rides r LEFT JOIN confirmations c USING (ride_id) WHERE c.request_id=$1",
                [data], function (err, result) {
                    if (err) {
                        callback(true, "Get error: " + err);
                    } else {
                        var queryResults = result.rows;
                        console.log(queryResults);
                        var results = queryResults[0];
                        console.log(results);
                        callback(false, results);
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.getRides = function (callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id,ride_id,origin, destination, seats, pay_type, min_payment,ts,max_delay,dest_address,origin_address FROM rides", function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });

        }

    }
    connect(onConnect);
}

exports.getRequest = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id, request_id,origin, destination, pay_type, max_payment,ts,dest_address,origin_address FROM requests WHERE request_id = $1",
                [data], function (err, result) {
                    if (err) {
                        callback(true, "Get error: " + err);
                    } else {
                        var queryResults = result.rows;
                        var results = queryResults[0];
                        callback(false, results);
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.getAssociatedRequest = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.user_id,r.request_id,r.origin,r.destination,r.pay_type, r.max_payment,r.ts,r.dest_address,r.origin_address FROM requests r LEFT JOIN confirmations c USING (request_id) WHERE c.ride_id=$1",
                [data], function (err, result) {
                    if (err) {
                        callback(true, "Get error: " + err);
                    } else {
                        var queryResults = result.rows;
                        var results = queryResults[0];
                        console.log("Results");
                        console.log(queryResults);
                        callback(false, results);
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.getRequests = function (callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id,request_id,origin, destination, pay_type, max_payment,ts,dest_address,origin_address FROM requests r WHERE NOT EXISTS(SELECT 1 FROM confirmations c WHERE r.request_id=c.request_id)", function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });
        }
    }

    connect(onConnect);
}

exports.getMyRequests = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT user_id,request_id,origin, destination, pay_type, max_payment,ts,dest_address,origin_address FROM requests r WHERE user_id = $1 AND NOT EXISTS(SELECT 1 FROM confirmations c WHERE r.request_id=c.request_id)",
                [data.userid], function (err, result) {
                    if (err) {
                        callback(true, "Get error: " + err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for (var i = 0; i < queryResults.length; i++) {
                            results.push(queryResults[i]);
                        }
                        callback(false, results);
                    }
                    client.end();
                });
        }
    }

    connect(onConnect);
}

exports.getPayType = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT pay_types FROM pay_types WHERE id = $1",
                [data], function (err, result) {
                    if (err) {
                        callback(true, "Get error: " + err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for (var i = 0; i < queryResults.length; i++) {
                            results.push(queryResults[i]);
                        }
                        callback(false, results);
                    }
                    client.end();
                });
        }
    }

    connect(onConnect);
}

exports.insertConfirmation = function (data, callback) {
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error: "DB error: " + message});
        }
        else {
            client.query("INSERT INTO confirmations(ride_id,user_id,request_id,requester_id) values($1,$2,$3,$4)",
                [data.ride_id, data.user_id, data.request_id, data.requester_id], function (err, result) {
                    if (err) {
                        callback(true, "Insert error: " + err);
                    } else {
                        callback(false, {status: "success"});
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.confirmRide = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            console.log("Confirm Error: " + err);
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("UPDATE confirmations SET confirmed=true WHERE ride_id=$1",
                [data], function (err, result) {
                    if (err) {
                        callback(true, "Confirmation error: " + err);
                    } else {
                        callback(false, {status: "success"});
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.completeRide = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("UPDATE confirmations SET completed=true WHERE ride_id=$1",
                [data.ride_id], function (err, result) {
                    if (err) {
                        callback(true, "Completion error: " + err);
                    } else {
                        callback(false, {status: "success"});
                    }
                    client.end();
                });
        }

    }
    connect(onConnect);
}

exports.updateRating = function (data, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("UPDATE users SET rating_total=rating_total+$1,rating_count=rating_count+1 WHERE user_id=$2",
                [data.rating, data.user_id], function (err, result) {
                    if (err) {
                        callback(true, "Completion error: " + err);
                    } else {
                        callback(false, {status: "success"});
                    }
                    client.end();
                });
        }
    };
    connect(onConnect);
}

exports.getPendingRequestConfirmation = function (user_id, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.ride_id,r.origin, r.destination, r.seats, r.pay_type, r.min_payment,r.ts,r.max_delay,r.dest_address,r.origin_address FROM rides r LEFT JOIN confirmations c USING (ride_id) WHERE c.user_id=$1 AND c.confirmed=FALSE", [user_id], function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });
        }
    }

    connect(onConnect);
}

exports.getPendingApproval = function (user_id, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.request_id,r.origin,r.destination,r.pay_type, r.max_payment,r.ts,r.dest_address,r.origin_address FROM requests r LEFT JOIN confirmations c USING (request_id) WHERE c.requester_id=$1 AND c.confirmed=FALSE", [user_id], function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });
        }
    }

    connect(onConnect);
}

exports.getConfirmedRides = function (user_id, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.ride_id,r.origin, r.destination, r.seats, r.pay_type, r.min_payment,r.ts,r.max_delay,r.dest_address,r.origin_address FROM rides r LEFT JOIN confirmations c USING (ride_id) WHERE c.user_id=$1 AND c.confirmed=TRUE AND c.completed=FALSE", [user_id], function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });
        }
    }

    connect(onConnect);
}

exports.getConfirmedRequests = function (user_id, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.request_id,r.origin,r.destination,r.pay_type, r.max_payment,r.ts,r.dest_address,r.origin_address FROM requests r LEFT JOIN confirmations c USING (request_id) WHERE c.requester_id=$1 AND c.confirmed=TRUE AND c.completed=FALSE", [user_id], function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });
        }
    }

    connect(onConnect);
}

exports.getHistoryRides = function (user_id, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.ride_id,r.origin, r.destination, r.seats, r.pay_type, r.min_payment,r.ts,r.max_delay,r.dest_address,r.origin_address FROM rides r LEFT JOIN confirmations c USING (ride_id) WHERE c.user_id=$1 AND c.completed=TRUE", [user_id], function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });
        }
    }

    connect(onConnect);
}

exports.getHistoryRequests = function (user_id, callback) {

    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, {error:"DB error: " + message});
        }
        else {
            client.query("SELECT r.request_id,r.origin,r.destination,r.pay_type, r.max_payment,r.ts,r.dest_address,r.origin_address FROM requests r LEFT JOIN confirmations c USING (request_id) WHERE c.requester_id=$1 AND c.completed=TRUE", [user_id], function (err, result) {
                if (err) {
                    callback(true, "Get error: " + err);
                } else {
                    var results = [];
                    var queryResults = result.rows;
                    for (var i = 0; i < queryResults.length; i++) {
                        results.push(queryResults[i]);
                    }
                    callback(false, results);
                }
                client.end();
            });
        }
    }

    connect(onConnect);
}