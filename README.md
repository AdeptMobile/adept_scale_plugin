AdeptScale Heroku CLI Plugin
================================

## Installation
- Install the [Heroku Toolbelt](https://toolbelt.heroku.com) if you do not already have it
- This plugin is hosted on [npmjs.org](https://www.npmjs.com/package/heroku-adept-scale) and can be installed with

```sh
$ heroku plugins:install heroku-adept-scale
$ heroku adept-scale -h
```

## Usage
##### Expected traffic example
If you know you are about to experience a massive traffic load and you want your app to be ready with running dynos even before the traffic arrives, you could raise the min and max dyno settings ahead of time to ensure your app would scale within the new parameters. To raise your min-dynos to 10 and your max dynos to 50 you could run:
```sh
$ heroku adept-scale:settings:set -n 10 -x 50 --app APPNAME
```
After your event, the same command could be used to return settings to normal.

## Development

#### Requirements:
- [Node.js](https://nodejs.org) and the included NPM

#### Setup:
- Clone the repo
```git clone git@github.com:AdeptMobile/adept_scale_plugin.git```
- Change to the plugin directory
```cd adept_scale_plugin```
- Install the npm packages
```npm install```
- Link the plugin directory on install and every time you make a change
```heroku plugins:link```
- Run your local plugin as normal. 
```heroku adept-scale -h```

> Tip: To make testing easier, try one-lining the link and the command you are developing:
```sh
$ heroku plugins:link; heroku adept-scale:settings:get --app myapp
```


## License
Copyright Adept Mobile LLC 2015. All rights reserved.
Read more in our [License](LICENSE) document.

> This plugin was built using the standard practice defined at the [Heroku Devcenter](https://devcenter.heroku.com/articles/developing-toolbelt-plug-ins)
