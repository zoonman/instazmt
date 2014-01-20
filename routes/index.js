
/*
 * GET home page.
 */

var queryString = require('querystring');
var mainApp;
exports.setApp = function (app) {
  mainApp = app;
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