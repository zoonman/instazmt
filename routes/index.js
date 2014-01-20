
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
  }

  if (req.session.access_token) {
    // check for actions
  } else {
    // prepare auth url
    var url = 'https://api.instagram.com/oauth/authorize/?';
    querystring.stringify({
      'client_id' : app.get('instagram client id'),
      'redirect_uri' : 'http://insta.zoonman.com/oauth',
      'response_type' : 'code',
      'scope' : 'likes comments relationships upload',
      'state' : 'someStateId'
    })
  }


  res.render('index', { title: 'Express', 'views': req.session.views });
};