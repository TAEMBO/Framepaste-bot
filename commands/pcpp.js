module.exports = {
	run: (client, message, args) => {
		message.reply({content: 'US: <https://pcpartpicker.com/list/>\nUK: <https://uk.pcpartpicker.com/list/>\nCanada: <https://ca.pcpartpicker.com/list/>\nGermany: <https://de.pcpartpicker.com/list/>\n*Note: Countries not included in list: Australia, Belgium, Spain, France, India, Ireland, Italy, Netherlands, New Zealand and Sweden. Please select the appropriate location using the dropdown menu on the top right of the pcpartpicker webpage.', allowedMentions: { repliedUser: false }});
	},
	name: 'pcpp',
	alias: ['pcpartpicker'],
	category: 'Real Computers'
};