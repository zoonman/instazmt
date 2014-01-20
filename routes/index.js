
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
exports.index = function(req, res){
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
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


  res.render('index', { title: 'Express', 'views': req.session.views, 'oauthUrl' : oauthUrl });
};


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

    httpsRes.on('data', function(d) {
      process.stdout.write(d);
      var responseObj = JSON.parse(d);
      callback(responseObj);
    });
  });
  httpsReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  httpsReq.write(queryString.stringify(params));
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
    'object' : 'tag','aspect' : 'media',

    'object_id' : 'happy',

    'verify_token' : 'myVerifyToken02',
    'callback_url' : 'http://insta.zoonman.com/realtime'
  }, function (data) {
    console.log(data);
  });
  res.send('Subscribed');
}

exports.tag_unsubscribe = function(req, res) {


}

exports.rt_handler = function(req, res) {
  console.log(new Date());
  console.log(req.body);

  if (typeof req.param('hub.challenge') !== 'undefined'
      && typeof req.param('hub.mode') !== 'undefined'

      ) {
    res.send(req.param('hub.challenge'));
  }
  else {
    res.send('200 OK');
/*
    insta_request('POST', '/v1/subscriptions/',{
      'client_id' : process.env.INSTAGRAM_CLIENT_ID,
      'client_secret' : process.env.INSTAGRAM_CLIENT_SECRET,
      'object' : 'tag','aspect' : 'media',

      'object_id' : 'happy',

      'verify_token' : 'myVerifyToken02',
      'callback_url' : 'http://insta.zoonman.com/realtime'
    }, function (data) {
      console.log(data);
    });
*/
  }

  if (typeof _io !== 'undefined') {
    _io.emit('message', {'message':req.body});

  }
}


