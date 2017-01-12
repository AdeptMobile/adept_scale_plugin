'use strict';
let url    = require('url');
let h      = require('heroku-cli-util');
let http   = require('http')
let vld    = require('../validate');

module.exports = {
    topic: 'adept-scale',
    command: 'settings:set',
    description: 'Change the current settings of the app',
    help: "This command lets you set one or many of the scale settings of your app.\n"+
        "Example: 'heroku adept-scale:settings:set -x=5 --app myapp'",
    needsApp: true,  // This command needs to be associated with an app (passed in the context argument)
    needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
    flags: [
        { name: 'scaling_is_active', char: 's', description: 'Sets the scaling_is_active for the app', hasValue: true },
        { name: 'max_dynos', char: 'x', description: 'Sets the max_dynos for the app', hasValue: true },
        { name: 'min_dynos', char: 'n', description: 'Sets the min_dynos for the app', hasValue: true },
        { name: 'expected_response_time', char: 't', description: 'Sets the expected_response_time for the app', hasValue: true },
        { name: 'sample_window', char: 'w', description: 'Sets the sample_window for the app', hasValue: true },
        { name: 'dyno_increase_rate', char: 'i', description: 'Sets the dyno_increase_rate for the app', hasValue: true },
        { name: 'dyno_decrease_rate', char: 'd', description: 'Sets the dyno_decrease_rate for the app', hasValue: true }
    ],
    variableArgs: false,
    args: [
        { name: 'dyno_type', optional: true, hidden: true },
    ],

    // this is the main entry point
    // context is information from the CLI with the current app, auth token, arguments, etc.
    // heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
    run: h.command(function* (context, heroku) {
        // Get the config vars for the app
        //TODO: figure out how we can DRY this out of here and into validate
        let config = yield heroku.apps(context.app).configVars().info();
        //parse out the config vars
        let loaded_creds = vld.loadAppCredentials(config);
        //for testing on development using ufc app
        // let loaded_creds = {app_id: '54d90760416c6559921e0000', license_key: '29369993-169a-4880-8210-2d457fa64c34'}

        //This is the data we are posting, it needs to be a string or a buffer
        var payload = JSON.stringify({ settings: context.flags, license_key: loaded_creds['license_key'] });

        var headers = {
          'Content-Type': 'application/json',
          'Content-Length': payload.length
        };

        var requestOptions = {
            // host: 'localhost',
            host: 'www.adeptscale.com',
            path: '/v1/apps/' + loaded_creds['app_id'],
            // port: '3000',
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
                console.log("\nUPDATED SETTINGS:");
                console.log("----------------------------------");
                h.columnify( res_data );
                console.log("----------------------------------\n");
            });
        }

        console.log('Starting request to change settings...');
        var req = http.request(requestOptions, responseCallback).on('error', function(er) {
            console.error('Error', er.message);
        });
        req.write( payload );
        req.end();
    })
};
