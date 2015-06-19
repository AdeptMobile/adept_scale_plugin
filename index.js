exports.topics = [{
	name: 'adept-scale',
	description: 'Manage AdeptScale automated scaling through the Heroku CLI'
}];

exports.commands = [
	{
		topic: 'adept-scale',
		default: true,
		description: 'Default welcome',
		help: "Welcome to the AdeptScale Heroku CLI Plugin Tool",
		run: function () {
			console.log('Welcome to the AdeptScale Heroku CLI Plugin Tool\n\n' +
						"Please use 'heroku help adept-scale' for an index of available commands.\n" +
						"You can also find more detail by calling help on a specific command, such as 'heroku help adept-scale:settings'\n\n" +
						"Thank you, and happy scaling.");
		}
	},
	{
		topic: 'adept-scale',
		command: 'version',
		description: 'tells you the version',
		help: 'Show latest version with adept-scale:version',
		run: function () {
			console.log('AdeptScale Heroku CLI Plugin version 0.0.1');
		}
	},
	require('./commands/settings/get'),
	require('./commands/settings/set'),
];
