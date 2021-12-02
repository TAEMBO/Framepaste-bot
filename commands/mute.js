module.exports = {
	run: (client, message, args) => {
		client.punish(client, message, args, 'mute');
	},
	name: 'mute',
	description: 'Mute a member.',
	usage: ['user mention or id', '?time', '?reason'],
	category: 'Moderation'
};