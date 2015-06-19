'use strict';
let url    = require('url');
let h      = require('heroku-cli-util');
let http   = require('http')

module.exports = {
    topic: 'adept-scale',
    command: 'settings:set',
    description: 'Change the current settings of the app',
    help: "This lets you set one of many of the scale settings of your app.",
    needsApp: true,  // This command needs to be associated with an app (passed in the context argument)
    needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)

    // this is the main entry point
    // context is information from the CLI with the current app, auth token, arguments, etc.
    // heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
    run: h.command(function* (context, heroku) {
        let app = yield heroku.apps(context.app).info();
        // Debug all about the app
        console.log('Heroku App ID: ', app.id);

        // Get the config vars for the app
        let config = yield heroku.apps(context.app).configVars().info();
        if (!config.ADEPT_SCALE_LICENSE_KEY) {
            console.error('App does not have ADEPT_SCALE_LICENSE_KEY, please contact AdeptScale support.');
            process.exit(1);
        }
        //Debug our license key
        console.log('Using Adept Scale License Key: ', config.ADEPT_SCALE_LICENSE_KEY);


        // TODO: For now, we do not have license keys in all our apps' configs, so lets just use app id
        // let apiUrl = url.parse("http://localhost:3000/v1/apps/21dd4b46-8b5d-44ca-a860-83f3ee58b161/settings");
        // console.log( apiUrl);

        var requestOptions = {
            host: 'localhost',
            path: '/v1/apps/' + config.ADEPT_SCALE_LICENSE_KEY,
            port: '3000',
            method: 'PUT'
        };

        console.log('Starting request to change settings...');

        var responseCallback = function(response) {
            var res_data = ''
            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                res_data += chunk;
            });

            response.on('end', function() {
                //finally we can process our response
                res_data = JSON.parse(res_data);
                //Display to user
                console.log("\n----------------------------------");
                h.columnify( res_data );
                console.log("----------------------------------\n");
            });
        }

        var req = http.request(requestOptions, responseCallback);
        //This is the data we are posting, it needs to be a string or a buffer
        req.write("hello world!");
        req.end();
    })
};
