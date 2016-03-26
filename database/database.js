/**
 * Created by Nikhil on 3/8/16.
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
            client.query("INSERT INTO rides(user_id,origin,destination,seats,pay_type,min_payment) values($1,$2,$3,$4,$5,$6)",
                [data.user_id,data.origin,data.dest,data.seats,data.pay_type,data.min_amt], function(err, result){
                    if(err){
                        callback(true,"New Ride error: "+err);
                    } 
                    else {
                        callback(false,"Successful Ride Add!");
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
            client.query("INSERT INTO requests(user_id,origin,destination,pay_type,max_payment) values($1,$2,$3,$4,$5)",
                [data.user_id,data.origin,data.dest,data.pay_type,data.max_pay], function(err, result){
                    if(err){
                        callback(true,"New Request error: "+err);
                    } 
                    else {
                        callback(false,"Successful Request Add!");
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
            client.query("SELECT * FROM rides WHERE user_id = $1",
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

exports.getMyRequests = function (data, callback) {
    
    const onConnect = function (err, client, message) {
        if (err) {
            callback(true, message);
        }
        else {
            client.query("SELECT * FROM requests WHERE user_id = $1",
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