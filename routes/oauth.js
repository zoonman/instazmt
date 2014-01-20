/**
 * Created by zoonman on 1/20/14.
 */

exports.connect = function(req, res){
  if (req.session.access_token) {
    // check for actions
  } else {
    if (typeof req.param('code') !== 'undefined') {
      // get access token
      res.send(req.param('code'));
    }
  }
};