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
            callback(true, message);
        }
        else {
            var uid = uuid.v4();
            client.query("INSERT INTO users(user_id,username,password,name,email,phno) values($1,$2,$3,$4,$5,$6)",
                [uid, data.uname, data.pwd, data.name, data.email, data.phno], function(err,result){
                if(err){
                    callback(true,"Insert error: "+err);
                } else {
                    callback(false,{user_id:uid});
                }
                    client.end();
            });

        }

    }
    connect(onConnect);
}

exports.getUser = function (data, callback) {
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, message);
        }
        else {
            client.query("SELECT * FROM users WHERE user_id = $1",
                [data.user_id], function(err,result){
                    if(err){
                        callback(true,"Get error: "+err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for(var i=0;i<queryResults.length;i++){
                            results.push(queryResults[i]);
                        }
                        callback(false,results);
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
            callback(true, message);
        }
        else {
            client.query("SELECT user_id FROM users where username=$1 AND password=$2",
                [data.uname, data.pwd], function(err,result){
                    if(err){
                        callback(true,"Get error: "+err);
                    } else {
                        if(result.rows.length>0)
                            callback(false,{user_id:result.rows[0].user_id});
                        else
                            callback(false,{error:"Invalid username/password"});
                    }
                    client.end();
                });

        }

    }
    connect(onConnect);
}

exports.createRide = function(data, callback){
    const onConnect = function(err, client, message){
        if(err){
            callback(true, message)
        }
        else{
            var ride_id = uuid.v4();
            client.query("INSERT INTO rides(ride_id,user_id,origin,destination,seats,pay_type,min_payment,max_delay) values($1,$2,$3,$4,$5,$6,$7,$8)",
                [ride_id,data.user_id,data.origin,data.dest,data.seats,data.pay_type,data.min_amt,data.max_delay], function(err, result){
                    if(err){
                        callback(true,"New Ride error: "+err);
                    }
                    else {
                        callback(false,{status:success});
                    }
                        client.end();

                });
        }
    }

    connect(onConnect)
}

exports.createRequest = function(data, callback){
    const onConnect = function(err, client, message){
        if(err){
            callback(true, message)
        }
        else{
            var request_id = uuid.v4();
            client.query("INSERT INTO requests(request_id,user_id,origin,destination,pay_type,max_payment,ts) values($1,$2,$3,$4,$5,$6,$7)",
                [request_id,data.user_id,data.origin,data.dest,data.pay_type,data.max_pay,data.timestamp], function(err, result){
                    if(err){
                        callback(true,"New Request error: "+err);
                    } 
                    else {
                        callback(false,{status:success});
                    }
                        client.end();

                });
        }
    }

    connect(onConnect)
}

exports.getMyRides = function (data, callback) {
    
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, message);
        }
        else {
            client.query("SELECT ride_id, origin, destination, seats, pay_type, min_payment,ts,max_delay FROM rides WHERE user_id = $1",
                [data], function(err,result){
                    if(err){
                        callback(true,"Get error: "+err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for(var i=0;i<queryResults.length;i++){
                            results.push(queryResults[i]);
                        }
                        callback(false,results);
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
            callback(true, message);
        }
        else {
            client.query("SELECT origin, destination, seats, pay_type, min_payment,ts,max_delay FROM rides WHERE ride_id = $1",
                [data], function(err,result){
                    if(err){
                        callback(true,"Get error: "+err);
                    } else {
                        var queryResults = result.rows;
                        var results = queryResults[0];
                        callback(false,results);
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
            callback(true, message);
        }
        else {
            client.query("SELECT user_id,request_id,origin, destination, pay_type, max_payment,ts FROM requests", function(err,result){
                    if(err){
                        callback(true,"Get error: "+err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for(var i=0;i<queryResults.length;i++){
                            results.push(queryResults[i]);
                        }
                        callback(false,results);
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
            callback(true, message);
        }
        else {
            client.query("SELECT request_id,origin, destination, pay_type, max_payment,ts FROM requests WHERE user_id = $1",
                [data.userid], function(err,result){
                    if(err){
                        callback(true,"Get error: "+err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for(var i=0;i<queryResults.length;i++){
                            results.push(queryResults[i]);
                        }
                        callback(false,results);
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
            callback(true, message);
        }
        else {
            client.query("SELECT pay_types FROM pay_types WHERE id = $1",
                [data], function(err,result){
                    if(err){
                        callback(true,"Get error: "+err);
                    } else {
                        var results = [];
                        var queryResults = result.rows;
                        for(var i=0;i<queryResults.length;i++){
                            results.push(queryResults[i]);
                        }
                        callback(false,results);
                    }
                    client.end();
                });
        }
    }

    connect(onConnect);
}