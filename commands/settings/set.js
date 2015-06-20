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
        // console.log('Heroku App ID: ', app.id);

        // Get the config vars for the app
        console.log('Validating license key for app: ', app.name);
        let config = yield heroku.apps(context.app).configVars().info();
        if (!config.ADEPT_SCALE_LICENSE_KEY) {
            console.error('App does not have ADEPT_SCALE_LICENSE_KEY, please contact AdeptScale support.');
            process.exit(1);
        }
        //Debug our license key
        // console.log('Using Adept Scale License Key: ', config.ADEPT_SCALE_LICENSE_KEY);


        //This is the data we are posting, it needs to be a string or a buffer
        var payload = JSON.stringify({
            settings: {
                dyno_type: 'web',
                scaling_is_active: true,
                max_dynos: null,
                min_dynos: null,
                expected_response_time: null,
                sample_window: null,
                dyno_increase_rate: null,
                dyno_decrease_rate: null
            }
        });
        console.log( payload );

        var headers = {
          'Content-Type': 'application/json',
          'Content-Length': payload.length
        };

        var requestOptions = {
            host: 'localhost',
            path: '/v1/apps/' + config.ADEPT_SCALE_LICENSE_KEY,
            port: '3000',
            method: 'PUT',
            headers: headers
        };

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

        console.log('Starting request to change settings...');
        var req = http.request(requestOptions, responseCallback);
        req.write( payload );
        req.end();
    })
};
