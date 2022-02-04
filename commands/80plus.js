module.exports = {
	run: (client, message, args) => {
		message.reply({content: 'https://www.guru3d.com/index.php?ct=articles&action=file&id=10061', allowedMentions: { repliedUser: false }});
	},
	name: '80plus',
	alias: ['80+', 'eightyplus'],
	description: 'PSU 80+ certification levels',
	category: 'Real Computers'
};