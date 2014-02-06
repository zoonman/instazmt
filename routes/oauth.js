/**
 * Created by zoonman on 1/20/14.
 */

var queryString = require('querystring');

exports.connect = function(req, res, next){
  console.log('exports.connect  console.log(req.session');
  console.log(req.session);
  var req1 = req;
  if (req.session.access_token) {
    // check for actions
  } else {
    if (typeof req.param('code') !== 'undefined') {
      // get access token

      var https = require('https');

      var options = {
        hostname: 'api.instagram.com',
        port: 443,
        path: '/oauth/access_token',
        method: 'POST'
      };

      var httpsReq = https.request(options, function(httpsRes) {
        console.log("statusCode: ", httpsRes.statusCode);
        console.log("headers: ", httpsRes.headers);
        httpsRes.on('data', function(d) {
          // process.stdout.write(d);
          var responseObj = JSON.parse(d);
          req1.session.zyxxx = 'blah1';
          req.session.access_token = responseObj.access_token;
          req.session.userInfo = responseObj.user;

          console.log('Getting access token');
          console.log(req.session);
          next();
        });
      });
      httpsReq.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      httpsReq.write(queryString.stringify({
        'client_id' : process.env.INSTAGRAM_CLIENT_ID,
        'client_secret' : process.env.INSTAGRAM_CLIENT_SECRET,
        'code' : req.param('code'),
        'grant_type' : 'authorization_code',
        'redirect_uri' : 'http://insta.zoonman.com/oauth'
      }))
      httpsReq.end();

      //res.redirect('/');
    }
    else {
      res.redirect('/?error=noOAuthCode');
    }
  }
};

exports.say = function(req, res, next){
  // res.send(req.param('code'));
  res.redirect('/');
}