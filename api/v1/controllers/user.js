var debug = require('debug')('x-code:v1:controllers:user'),
    moment = require('moment'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    path = require('path'),
    shortid = require('shortid'),
    _ = require('underscore'),

    UserSchema = require('../models/User'),

    config = rootRequire('config/global'),
    ED = rootRequire('services/encry_decry'),
    Uploader = rootRequire('support/uploader'),
    Mailer = rootRequire('support/mailer'),
    DS = rootRequire('services/date'); // date services

module.exports = {

    login: function(req, res) {
        async.waterfall([
            function(nextCall) { // check required parameters

                req.checkBody('email', 'Email is required').notEmpty(); // Name is required
                req.checkBody('email', 'Email is not valid').isEmail();
                req.checkBody('password', 'Password is required').notEmpty(); // password is required

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },
            function(body, nextCall) {

                var jwtData = {
                    _id: 1,
                    email: body.email
                };

                // create a token
                body.access_token = jwt.sign(jwtData, config.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                nextCall(null, body);
            },
            function(body, nextCall) {
                //Not connected with database so directly sending reponse 
                // return the information including token as JSON
                nextCall(null, {
                    statusCode: 200,
                    status: 1,
                    message: 'Login successfully',
                    data: body
                });
            }
        ], function(err, response) {
            if (err) {
                debug('Login Error', err);
                return res.sendToEncode({ statusCode: 400, status: 0, message: (err && err.message) || "Oops! You could not be logged in." });
            }

            res.sendToEncode(response);
        });
    },

    test: function (req, res) {
        res.sendToEncode({ status: 1, message: "TEST MESSAGE", data: { message: 'test' } });
    }

};
