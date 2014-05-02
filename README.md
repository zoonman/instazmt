Instagram Realtime Updates Sample Application
=============================================

Uses Node.js as backend and Websockets to deliver updates into browser.

For real work you need to setup environment variables
INSTAGRAM_CLIENT_ID & INSTAGRAM_CLIENT_SECRET

Type in shell

    export INSTAGRAM_CLIENT_ID=YouInstaramClientID
    export INSTAGRAM_CLIENT_SECRET=YourInstagramSecret
    node app.js

Required to run: memcached, express, jade, socket.io, session.socket.io, querystring.
AngularJS is used for frontend rendering.
Install dependencies by running command

    npm install

Run app.

Done!
