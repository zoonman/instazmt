Instagram Realtime Updates Sample Application
=============================================

Uses Node.js as backend and Websockets to deliver updates into browser.

Required to run: memcached, express, jade, socket.io, session.socket.io, querystring.
AngularJS is used for frontend rendering.
Install dependencies by the following command:

    npm install

After it you can run the app. But first you need to setup environment variables
INSTAGRAM_CLIENT_ID & INSTAGRAM_CLIENT_SECRET

Type in shell:

    export INSTAGRAM_CLIENT_ID=YouInstaramClientID
    export INSTAGRAM_CLIENT_SECRET=YourInstagramSecret

Now you can run the app

    node app.js

Done! Open http://localhost:3001/

[![Build Status](https://travis-ci.org/zoonman/instazmt.svg?branch=master)](https://travis-ci.org/zoonman/instazmt)
