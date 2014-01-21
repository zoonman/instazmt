
/*
 * GET home page.
 */

var queryString = require('querystring');
var mainApp;
var requestStack = {};
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
        var responseObj = JSON.parse(responseBody);
        callback(responseObj);
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
    'object' : 'tag','aspect' : 'media',
    'object_id' : req.param('tag'),
    'verify_token' : 'myVerifyToken02'+prepareCSRFtoken() ,
    'callback_url' : 'http://insta.zoonman.com/realtime'
  }, function (data) {
    console.log(data);
  });
  // res.redirect('/');
  res.send('Subscribed. <a href="/">next</a>');
}

function getRecentTagData(tag) {
  insta_request('GET', '/v1/tags/' + tag + '/media/recent?client_id=' + process.env.INSTAGRAM_CLIENT_ID, null , function (data) {
    console.log(data);

    if (typeof _io !== 'undefined') {

      _io.emit('message', {'message': data});
      _io.broadcast.emit('message', {'message': data});
    }
  });
}

exports.tag_unsubscribe = function(req, res) {


}

exports.rt_handler = function(req, res) {
  console.log(new Date());
  if (typeof req.param('hub.challenge') !== 'undefined'
      && typeof req.param('hub.mode') !== 'undefined'

      ) {
    res.send(req.param('hub.challenge'));
  }
  else {
    console.log('--//');
    console.log(req.body[0].object_id);
    console.log('//--');



    // throttling
    if (typeof requestStack[req.body[0].object_id] === 'undefined') {
      requestStack[req.body[0].object_id] = new Date();
      getRecentTagData(req.body[0].object_id);
    }
    if ( (new Date()) - requestStack[req.body[0].object_id] > 5000) {
      getRecentTagData(req.body[0].object_id);
    }

    res.send('200 OK');

  }

  if (typeof _io !== 'undefined') {
    // _io.emit('message', {'message':req.body});
  }
}


