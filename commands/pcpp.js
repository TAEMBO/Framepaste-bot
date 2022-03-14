module.exports = {
	run: (client, message, args) => {
		const embed = new client.embed()
        .setTitle(`Please check the PCPartPicker site based on where you reside:`)
		.setDescription('[United States](https://pcpartpicker.com/list/) :flag_us:\n[United Kingdom](https://uk.pcpartpicker.com/list/) :flag_gb:\n[Canada](https://ca.pcpartpicker.com/list/) :flag_ca:\n[Germany](https://de.pcpartpicker.com/list/) :flag_de:\n[Australia](https://au.pcpartpicker.com/list/) :flag_au:\n[New Zealand](https://nz.pcpartpicker.com/list/) :flag_nz:\n[United Arab Emirates](https://ae.pcpartpicker.com/list/) :flag_ae:\n[Philippines](https://ph.pcpartpicker.com/list/) :flag_ph:')
        .setColor(client.config.embedColor)
		.addField('Note:', 'For countries not included in list please select the appropriate location using the dropdown menu on the top right of the PCPartPicker webpage.')
		.setFooter({text: 'cloned from discord.gg/buildapc', iconURL: 'https://cdn.discordapp.com/icons/286168815585198080/a_e1016a9b8d8f7c97dafef6b655e0d1b1.webp'})
		message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
	},
	name: 'pcpp',
	alias: ['pcpartpicker'],
	category: 'Real Computers'
};