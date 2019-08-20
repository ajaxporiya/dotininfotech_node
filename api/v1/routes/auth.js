var debug = require('debug')('x-code:v1:routes'),
    express = require('express'),
    router = express.Router(),

    isLoggedInPolicie = require('../policies/isLoggedIn.js'),
    isUserAuthenticatedPolicy = require('../policies/isUserAuthenticated.js'),

    UserController = require('../controllers/user.js');

var decodeReqPolicy = require('../policies/decodeRequest.js');
var encodeResPolicy = require('../policies/encodeResponse.js');
var AESCrypt = rootRequire('services/aes');

router.get('/encode', function(req, res) {
    res.render('encode');
});

router.post('/encode', function(req, res) {
    var body = req.body;

    debug('ENCODE BREQ BODY :->', body);

    try {
        var json = eval("(" + body.data + ")");
        var enc = AESCrypt.encrypt(JSON.stringify(json));
    } catch (e) {
        var enc = 'Invalid parameters';
    }
    res.send({ "encoded": enc });
});

router.get('/decode', function(req, res) {
    res.render('decode');
});

router.post('/decode', function(req, res) {
    var body = req.body;

    debug('DECODE REQ BODY :->', body);

    try {
        var dec = AESCrypt.decrypt(JSON.stringify(body.data));
    } catch (e) {
        var dec = 'Invalid parameters';
    }
    res.send(dec);
});

// decode request data
router.all('/*', function(req, res, next) {
    res.sendToEncode = function(data) {
        req.resbody = data;
        next();
    };
    next();
}, decodeReqPolicy);

/**
 * Users Account & Authentication APIs
 */
router.post('/auth/login', UserController.login);


/**
 * Authentication Middleware (BEFORE)
 * Serve all apis before MIDDLE if they serve like /api/*
 */
router.all('/api/*', isUserAuthenticatedPolicy, isLoggedInPolicie);


/**
 * Other APIs Routes (MIDDLE)
 */
router.get('/api/test', UserController.test);


/**
 * Responses Middleware (AFTER)
 * Serve all apis after MIDDLE if they serve like /api/*
 */
router.all('/*', encodeResPolicy);


// exports router
module.exports = router;
