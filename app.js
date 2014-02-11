
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
var requestStack = {};
var appSessionSecret = 'woof-woof';
var cookieParser = express.cookieParser(appSessionSecret);


var memcachedStorage = require('connect-memcached')(express);
var sessionStore;

// all environments
app.set('port', process.env.PORT || 3001);
app.set('host', process.env.HOST || "127.0.0.1");


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({
  secret: appSessionSecret,
  store: sessionStore = new memcachedStorage({
    hosts:['127.0.0.1:11211']
  })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('title', 'L!VE Instagram');
app.set('requestStack', requestStack);

routes.setApp(app);

app.get('/', routes.index);
app.get('/subscribe', routes.tag_subscribe);
app.get('/unsubscribe', routes.tag_unsubscribe);
app.get('/realtime', routes.rt_handler);
app.post('/realtime', routes.rt_handler);
app.get('/users', user.list);
app.get('/oauth', oauth.connect, oauth.say);

var server = http.createServer(app);

var io = require('socket.io').listen( server);
server.listen(app.get('port'), app.get('host'));

var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

// handling for connection setup
sessionSockets.on('connection', function (err, socket, session) {
  console.log('application started')
  routes.setIO(socket, session);
});
