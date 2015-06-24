#AdeptScale Heroku CLI Plugin

##Install
coming soon

##Use
coming soon

##Development

####Requirements:
[Heroku Toolbelt](https://toolbelt.heroku.com)
[Node.js](https://nodejs.org) and the included NPM

####Setup:
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
```heroku plugins:link; heroku adept-scale:settings:get --app myapp```


##License
Copyright Adept Mobile LLC 2015. All rights reserved.
Read more in our [License](LICENSE) document.

> This plugin was built using the standard practice defined at the [Heroku Devcenter](https://devcenter.heroku.com/articles/developing-toolbelt-plug-ins)
