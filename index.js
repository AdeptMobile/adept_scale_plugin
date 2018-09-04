exports.version = require('./package.json').version;

exports.topics = [{
	name: 'adept-scale',
	description: 'Manage AdeptScale automated scaling through the Heroku CLI'
}];

exports.commands = [
	{
		topic: 'adept-scale',
		default: true,
		description: 'Welcome to the AdeptScale Heroku CLI Plugin Tool',
		help: "Use `heroku adept-scale:settings -h` for info on the settings interface",
		run: function () {
			console.log('Welcome to the AdeptScale Heroku CLI Plugin Tool\n\n' +
						"Please use 'heroku adept-scale:settings -h' for an index of available settings commands.\n\n" +
						"Thank you, and happy scaling.");
		}
	},
	{
		topic: 'adept-scale',
		command: 'version',
		description: 'tells you the version',
		help: 'Show latest version with adept-scale:version',
		run: function () {
			console.log('AdeptScale Heroku CLI Plugin version', exports.version);
		}
	},
	require('./commands/settings/get'),
	require('./commands/settings/set'),
];

