var express = require('express');
const basicAuth = require('express-basic-auth')
var User = require('../lib/user');
var Entry = require('../lib/entry');

// exports.auth = basicAuth(User.authenticate);
exports.auth =  (req, res, next) => {
    var header = req.headers.authorization || '';
    var token = header.split(/\s+/).pop() || '';  
    var auth = Buffer.from(token, 'base64').toString(); 
    var parts = auth.split(/:/); 
    var username = parts.shift();  
    var password = parts.join(':');  
    basicAuth({
        authorizer: User.authenticate(username, password, (err, user) => {
            if (err) return next(err);
            req.remoteUser = user;
            next();
        }),
    })
};
 
exports.user = (req, res, next) => {
    User.get(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user.id) return res.send(404);
        res.json(user);
    });
};

exports.entries = (req, res, next) => {
    var page = req.page;
    Entry.getRange(page.from, page.to, (err, entries) => {
        if (err) return next(err);
        res.json(entries);
    });
};