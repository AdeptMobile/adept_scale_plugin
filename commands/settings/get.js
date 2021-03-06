'use strict';
let url    = require('url');
let h      = require('heroku-cli-util');
let http   = require('http');
let vld    = require('../validate');

module.exports = {
    topic: 'adept-scale',
    command: 'settings:get',
    description: 'Display the current settings of the app',
    help: "This is a getter to find out the current scale settings of your app.\n" +
            "Returned values:\n" +
            "----------------------------------\n" +
            "app_name\n" +
            "dyno_type\n" +
            "max_dynos\n" +
            "min_dynos\n" +
            "scaling_is_active\n" +
            "updated_at\n" +
            "expected_response_time\n" +
            "sample_window\n" +
            "dyno_increase_rate\n" +
            "dyno_decrease_rate\n" +
            "----------------------------------",
    // variableArgs: false,
    // args: [
    //     { name: 'dyno_type', optional: true, hidden: true },
    // ],
    needsApp: true,  // This command needs to be associated with an app (passed in the context argument)
    needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)

    // this is the main entry point
    // context is information from the CLI with the current app, auth token, arguments, etc.
    // heroku is an already authenticated heroku-client instance https://www.npmjs.com/package/heroku-client
    run: h.command(function* (context, heroku) {
        // let app = yield heroku.apps(context.app).info();
        // Debug all about the app
        // console.log('Heroku App ID: ', app.id);
        // console.log('Validating license key for app: ', app.name);

        // Get the config vars for the app
        //TODO: figure out how we can DRY this out of here and into validate
        let config = yield heroku.apps(context.app).configVars().info();
        //parse out the config vars
        let loaded_creds = vld.loadAppCredentials(config);

        // Contact AdeptScale API providing the app id and license key and make our request
        var path_root = "http://www.adeptscale.com/v1/apps/"

        //add any params we need or want
        var url_params = "license_key=" + loaded_creds['license_key']
        // if( context.args['dyno_type'] ){
        //     url_params += "&dyno_type=" + context.args['dyno_type']
        // }

        let apiUrl = url.parse(path_root + loaded_creds['app_id'] + "?" + url_params);
        //For debug using localhost and UFC app
        // let apiUrl = url.parse("http://localhost:3000/v1/apps/54d90760416c6559921e0000?license_key=29369993-169a-4880-8210-2d457fa64c34");
        // console.log("Validated API URL:", apiUrl);

        var res_data = '';
        var req = http.request(apiUrl, function(res) {
            // console.log('STATUS: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                //Add any chunks of response
                res_data += chunk
            });
            res.on('end', function() {
                //finally we can process our response
                res_data = JSON.parse(res_data);
                //Display to user
                console.log("\n----------------------------------");
                h.columnify( res_data );
                console.log("----------------------------------\n");
            });
        }).on('error', function(er) {
            console.error('Error', er.message);
        });
        req.end();
    })
};
