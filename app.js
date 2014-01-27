
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var routes = require('./routes');
var user = require('./routes/user');
var oauth = require('./routes/oauth');
var http = require('http');
var path = require('path');





var memcachedStorage = require('connect-memcached')(express);

// all environments
app.set('port', process.env.PORT || 3001);
app.set('host', process.env.HOST || "127.0.0.1");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//
app.set('title', 'L!VE Instagram');


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('zmNDJSession'));
app.use(express.session({
  secret:'woof-woof',
  store: new memcachedStorage({
    hosts:['127.0.0.1:11211']
  })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes.setApp(app);

app.get('/', routes.index);
app.get('/subscribe', routes.tag_subscribe);
app.get('/unsubscribe', routes.tag_unsubscribe);
app.get('/realtime', routes.rt_handler);
app.post('/realtime', routes.rt_handler);
app.get('/users', user.list);
app.get('/oauth', oauth.connect);

var server = http.createServer(app);

var io = require('socket.io').listen( server);
server.listen(app.get('port'), app.get('host'));
;

// handling for connection setup
io.sockets.on('connection', function (socket) {
  console.log('application started')
  //console.dir(socket);

  routes.setIO(socket);

});
