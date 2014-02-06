
/*
 * GET home page.
 */

var queryString = require('querystring');
var mainApp;

var _io;
exports.setApp = function (app) {
  mainApp = app;
}
exports.setIO = function (new_io) {
  _io = new_io;
}

exports.requestStack = {};

exports.index = function(req, res){
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
  }

  if (typeof req.session.access_token === 'undefined') {
    req.session.access_token = '';
  }

  if (typeof req.session.userInfo === 'undefined') {
    req.session.userInfo = {};
  }

  var oauthUrl = '';
  if (req.session.access_token) {
    // check for actions
  } else {
    // prepare auth url
    var oauthUrl = 'https://api.instagram.com/oauth/authorize/?'+
    queryString.stringify({
      'client_id' : process.env.INSTAGRAM_CLIENT_ID,
      'redirect_uri' : 'http://insta.zoonman.com/oauth',
      'response_type' : 'code',
      'scope' : 'likes comments relationships',
      'state' : 'someStateId'
    })
  }
  console.log(req.session);

  res.render('index', { title: 'L!VE Instagram', 'views': req.session.views, 'oauthUrl' : oauthUrl, 'sessionDetails': req.session });
};

function prepareCSRFtoken() {
  var csrf = '', i;
  for(i=0; i< 16; i++) {
    csrf += String.fromCharCode( Math.round(Math.random()*23 + 97)  );
  }
  return csrf;
}

function insta_request(method, endpoint, params, callback) {
  var https = require('https');

  var options = {
    hostname: 'api.instagram.com',
    port: 443,
    path: endpoint,
    method: method
  };

  var httpsReq = https.request(options, function(httpsRes) {
    console.log("statusCode: ", httpsRes.statusCode);
    console.log("headers: ", httpsRes.headers);


      var responseBody = '';
      httpsRes.on('data', function(chunk) {
        responseBody += chunk;
      });
      httpsRes.on('end', function() {
        try {
          var responseObj = JSON.parse(responseBody);
          callback(responseObj);
        } catch (e) {
          console.log('insta_request response');

          console.log(e);
        }

      });

  });
  httpsReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  if (params) {
    httpsReq.write(queryString.stringify(params));
  }
  httpsReq.end();
}

exports.tag_subscribe = function(req, res) {
  /*

   'object' : 'geography',
   'lat' : 42.3394574,
   'lng' :-71.1596649999,
   'radius' : 5000,
   */
  insta_request('POST', '/v1/subscriptions/',{
    'client_id' : process.env.INSTAGRAM_CLIENT_ID,
    'client_secret' : process.env.INSTAGRAM_CLIENT_SECRET,
    'object' : 'tag',
    'aspect' : 'media',
    'object_id' : req.param('tag'),
    'verify_token' : 'myVerifyToken02'+prepareCSRFtoken() ,
    'callback_url' : 'http://insta.zoonman.com/realtime'
  }, function (data) {
    console.log('tag_subscribe');
    console.log(data);
    res.redirect('/');

  });
  // res.redirect('/');
  // res.send('Subscribed. <a href="/">next</a>');
  getSubscriptions();
}

function getSubscriptions() {
  insta_request('GET', '/v1/subscriptions?client_secret=' + process.env.INSTAGRAM_CLIENT_SECRET
       +'&client_id=' + process.env.INSTAGRAM_CLIENT_ID, null , function (data) {
    console.log('getSubscriptions');
    console.log(data);

    if (typeof _io !== 'undefined') {
      _io.emit('subscriptions', {'message': data});
    }
  });
}

function getRecentTagData(tag) {
  insta_request('GET', '/v1/tags/' + tag + '/media/recent?client_id=' + process.env.INSTAGRAM_CLIENT_ID, null , function (data) {
    console.log('getRecentTagData');
    console.log(data);

    if (typeof _io !== 'undefined') {

      _io.emit('message', {'message': data});
      _io.broadcast.emit('message', {'message': data});
    }
  });
}

exports.tag_unsubscribe = function(req, res) {
  insta_request('DELETE', '/v1/subscriptions/',{
    'client_id' : process.env.INSTAGRAM_CLIENT_ID,
    'client_secret' : process.env.INSTAGRAM_CLIENT_SECRET,
    'object' : 'tag',
    'aspect' : 'media',
    'object_id' : req.param('tag'),
    'verify_token' : 'myVerifyToken02'+prepareCSRFtoken() ,
    'callback_url' : 'http://insta.zoonman.com/realtime'
  }, function (data) {
    console.log('tag_unsubscribe');
    console.log(data);
    res.redirect('/');

  });
}

exports.rt_handler = function(req, res) {
  console.log(new Date());
  if (typeof req.param('hub.challenge') !== 'undefined'
      && typeof req.param('hub.mode') !== 'undefined'

      ) {
    res.send(req.param('hub.challenge'));
  }
  else {
    //console.log('--//');
    //console.log(req.body[0].object_id);
    //console.log('//--');


    var objectHash = 'default';
    if (typeof  req.body[0] !== 'undefined'
        && typeof  req.body[0].object_id !== 'undefined') {
      objectHash = req.body[0].object_id;
    }
    // throttling
    if (typeof exports.requestStack[objectHash] === 'undefined') {
      var dt = new Date();
      exports.requestStack[objectHash] = Date.now();
      //getRecentTagData(objectHash);
    }
    //console.log(exports.requestStack[objectHash]);
    //console.log(Date.now());
    if (  Date.now() -  exports.requestStack[objectHash] > 5000) {
      ///getRecentTagData(objectHash);
      exports.requestStack[objectHash] = Date.now();
      console.log('getting...');

    } else {
      console.log('trottling...');
    }

    res.send('200 OK');

  }

  if (typeof _io !== 'undefined') {
    // _io.emit('message', {'message':req.body});
  }
}


