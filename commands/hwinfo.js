module.exports = {
	run: (client, message, args) => {
		message.reply({content: 'https://www.hwinfo.com/', allowedMentions: { repliedUser: false }});
	},
	name: 'hwinfo',
	description: 'HWiNFO download link',
	category: 'Real Computers'
};