
/* Load app credentials from the apps config listing.*/
// @requires: heroku-cli-util
// @param: context => a context passed in from heroku.command
// @param: heroku => heroku obj passed in from heroku.command
// expects a context and heroku from
// TODO: we should follow the above prototype and do the yield heroku.apps(context.app).configVars().info(); in here....
exports.loadAppCredentials = function(config){
    if (!config.ADEPT_SCALE_LICENSE_KEY) {
        console.error('App does not have ADEPT_SCALE_LICENSE_KEY, please contact AdeptScale support.');
        process.exit(1);
    }
    var app_id = config.ADEPT_SCALE_URL.split('/').pop();
    //Debug our license key
    // console.log('App License id for app: ', app_id);
    // console.log('Using Adept Scale License Key: ', config.ADEPT_SCALE_LICENSE_KEY);

    return { app_id: app_id, license_key: config.ADEPT_SCALE_LICENSE_KEY }
};
